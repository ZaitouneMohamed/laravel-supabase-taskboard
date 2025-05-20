<?php

namespace Database\Seeders;

use App\Models\BoardType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BoardTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Feature Requests',
                'description' => 'Collect and prioritize feature ideas from your team or customers',
                'icon' => 'lightbulb',
            ],
            [
                'name' => 'Roadmap',
                'description' => 'Plan and track your product development timeline',
                'icon' => 'map',
            ],
            [
                'name' => 'Sprint Planning',
                'description' => 'Organize your team\'s work for upcoming sprint cycles',
                'icon' => 'sprint',
            ],
            [
                'name' => 'Retrospective',
                'description' => 'Reflect on past work and find opportunities to improve',
                'icon' => 'refresh-cw',
            ],
            [
                'name' => 'Ideas Board',
                'description' => 'Brainstorm and collect ideas in a collaborative space',
                'icon' => 'bulb',
            ],
            [
                'name' => 'Team Goals',
                'description' => 'Define and track team objectives and key results',
                'icon' => 'target',
            ],
        ];

        foreach ($types as $type) {
            BoardType::create([
                'name' => $type['name'],
                'slug' => Str::slug($type['name']),
                'description' => $type['description'],
                'icon' => $type['icon'],
                'is_active' => true,
            ]);
        }
    }
}
