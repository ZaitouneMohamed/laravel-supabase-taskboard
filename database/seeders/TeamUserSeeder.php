<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = Team::all();
        $users = User::all();

        if ($teams->isEmpty() || $users->isEmpty()) {
            $this->command->info('No teams or users found. Please run the teams and users seeders first.');
            return;
        }

        // Clear existing pivot table data to avoid duplicates
        // Adjust table name if your pivot table is named differently
        DB::table('team_user')->truncate();

        // Define team roles
        $roles = ['admin', 'member', 'viewer'];

        foreach ($teams as $team) {
            // Add the team owner as an admin (if they're not already added)
            DB::table('team_user')->insert([
                'team_id' => $team->id,
                'user_id' => $team->owner_id,
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Get owner to exclude from random assignments
            $ownerId = $team->owner_id;

            // Add 3-8 random users to each team with random roles
            $randomUsers = $users->where('id', '!=', $ownerId)
                                 ->random(rand(3, min(8, $users->count() - 1)));

            foreach ($randomUsers as $user) {
                // Assign a random role
                $role = $roles[array_rand($roles)];

                DB::table('team_user')->insert([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'role' => $role,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Team user relationships created successfully.');
    }
}
