<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardItems;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Get task statistics
        $taskStats = $this->getTaskStats();
        \Log::info('Task Stats:', ['data' => $taskStats]);

        // Get task completion trend data
        $taskCompletionData = $this->getTaskCompletionData();

        // Get tasks by status
        $tasksByStatus = $this->getTasksByStatus();

        // Get productivity data
        $productivityData = $this->getProductivityData();

        // Get recent tasks
        $recentTasks = $this->getRecentTasks();

        // Get top performers
        $topPerformers = $this->getTopPerformers();

        $data = [
            'taskStats' => $taskStats,
            'taskCompletionData' => $taskCompletionData,
            'tasksByStatus' => $tasksByStatus,
            'productivityData' => $productivityData,
            'recentTasks' => $recentTasks,
            'topPerformers' => $topPerformers,
        ];

        \Log::info('Dashboard Data:', $data);

        return Inertia::render('Dashboard', $data);
    }

    private function getTaskStats()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        // Get the counts, defaulting to 0 if no records exist
        $completedTasksThisMonth = Task::where('completed', true)
            ->whereBetween('updated_at', [$startOfMonth, $now])
            ->count();

        $completedTasksLastMonth = Task::where('completed', true)
            ->whereBetween('updated_at', [
                $startOfMonth->copy()->subMonth(),
                $startOfMonth->copy()->subSecond()
            ])
            ->count();

        $inProgressTasks = Task::where('completed', false)->count();
        $overdueTasks = Task::where('completed', false)
            ->where('due_date', '<', $now)
            ->count();

        $activeTeamMembers = User::whereHas('tasks', function ($query) use ($startOfMonth) {
            $query->where('updated_at', '>=', $startOfMonth);
        })->count();

        // Always return the stats array, even if all values are 0
        return [
            [
                'title' => 'Completed Tasks',
                'value' => (string)$completedTasksThisMonth,
                'change' => $completedTasksLastMonth > 0
                    ? sprintf('%+.1f%%', (($completedTasksThisMonth - $completedTasksLastMonth) / $completedTasksLastMonth) * 100)
                    : '+0%',
                'trend' => $completedTasksThisMonth >= $completedTasksLastMonth ? 'up' : 'down',
                'color' => 'emerald',
                'description' => 'This month'
            ],
            [
                'title' => 'In Progress',
                'value' => (string)$inProgressTasks,
                'change' => '+0%',
                'trend' => 'neutral',
                'color' => 'blue',
                'description' => 'Active tasks'
            ],
            [
                'title' => 'Overdue',
                'value' => (string)$overdueTasks,
                'change' => '+0%',
                'trend' => 'neutral',
                'color' => 'red',
                'description' => 'Need attention'
            ],
            [
                'title' => 'Team Members',
                'value' => (string)max(1, $activeTeamMembers), // Ensure at least 1 team member
                'change' => '+0%',
                'trend' => 'neutral',
                'color' => 'purple',
                'description' => 'Active contributors'
            ]
        ];
    }

    private function getTaskCompletionData()
    {
        $weeks = [];
        $startDate = Carbon::now()->subWeeks(6)->startOfWeek();

        // Always return 7 weeks of data, even if empty
        for ($i = 0; $i < 7; $i++) {
            $weekStart = $startDate->copy()->addWeeks($i);
            $weekEnd = $weekStart->copy()->endOfWeek();

            $completed = Task::where('completed', true)
                ->whereBetween('updated_at', [$weekStart, $weekEnd])
                ->count();

            $created = Task::whereBetween('created_at', [$weekStart, $weekEnd])
                ->count();

            $weeks[] = [
                'week' => 'Week ' . ($i + 1),
                'completed' => $completed,
                'created' => $created
            ];
        }

        return $weeks;
    }

    private function getTasksByStatus()
    {
        $statuses = [
            ['name' => 'Completed', 'color' => '#10B981'],
            ['name' => 'In Progress', 'color' => '#3B82F6'],
            ['name' => 'To Do', 'color' => '#F59E0B'],
            ['name' => 'Review', 'color' => '#8B5CF6'],
            ['name' => 'Overdue', 'color' => '#EF4444']
        ];

        $now = Carbon::now();
        $result = [];

        // Always return all statuses, even if count is 0
        foreach ($statuses as $status) {
            $query = Task::query();

            if ($status['name'] === 'Completed') {
                $query->where('completed', true);
            } elseif ($status['name'] === 'Overdue') {
                $query->where('completed', false)
                    ->where('due_date', '<', $now);
            } elseif ($status['name'] === 'In Progress') {
                $query->where('completed', false)
                    ->whereNotNull('started_at');
            } elseif ($status['name'] === 'To Do') {
                $query->where('completed', false)
                    ->whereNull('started_at');
            }

            $result[] = [
                'name' => $status['name'],
                'value' => $query->count(),
                'color' => $status['color']
            ];
        }

        return $result;
    }

    private function getProductivityData()
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $result = [];

        // Always return all days, even if count is 0
        foreach ($days as $index => $day) {
            $dayOfWeek = $index + 1;
            $tasksCompleted = Task::where('completed', true)
                ->whereRaw('DAYOFWEEK(updated_at) = ?', [$dayOfWeek])
                ->count();

            $result[] = [
                'day' => $day,
                'tasksCompleted' => $tasksCompleted,
                'timeSpent' => 0 // Set to 0 instead of random value
            ];
        }

        return $result;
    }

    private function getRecentTasks()
    {
        $tasks = BoardItems::with(['creator', 'tasks'])
            ->latest()
            ->take(4)
            ->get();

        // If no tasks exist, return an empty array
        if ($tasks->isEmpty()) {
            return [];
        }

        return $tasks->map(function ($item) {
            $totalTasks = $item->tasks->count();
            $completedTasks = $item->tasks->where('completed', true)->count();
            $progress = $totalTasks > 0 ? ($completedTasks / $totalTasks) * 100 : 0;

            return [
                'id' => $item->id,
                'title' => $item->title,
                'assignee' => $item->creator->name,
                'priority' => ucfirst($item->priority),
                'status' => $item->status,
                'dueDate' => $item->due_date ? Carbon::parse($item->due_date)->format('Y-m-d') : null,
                'progress' => round($progress)
            ];
        });
    }

    private function getTopPerformers()
    {
        $performers = User::withCount(['tasks' => function ($query) {
            $query->where('completed', true)
                ->where('updated_at', '>=', Carbon::now()->subMonth());
        }])
        ->orderByDesc('tasks_count')
        ->take(4)
        ->get();

        // If no performers exist, return at least one default entry
        if ($performers->isEmpty()) {
            return [[
                'name' => Auth::user()->name ?? 'Team Member',
                'tasksCompleted' => 0,
                'avatar' => '👤'
            ]];
        }

        return $performers->map(function ($user) {
            return [
                'name' => $user->name,
                'tasksCompleted' => $user->tasks_count,
                'avatar' => '👤'
            ];
        });
    }
}
