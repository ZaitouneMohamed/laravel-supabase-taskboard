<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Product Development',
                'description' => 'Team responsible for product strategy and development',
            ],
            [
                'name' => 'Engineering',
                'description' => 'Backend and infrastructure development team',
            ],
            [
                'name' => 'Design',
                'description' => 'UI/UX and product design team',
            ],
            [
                'name' => 'Marketing',
                'description' => 'Marketing strategy and campaigns team',
            ],
            [
                'name' => 'Customer Success',
                'description' => 'Customer support and success management',
            ],
        ];

        // Get some random users to be team owners
        $users = User::inRandomOrder()->take(count($teams))->get();

        foreach ($teams as $index => $teamData) {
            $owner = $users[$index] ?? User::first();

            Team::create([
                'name' => $teamData['name'],
                'slug' => Str::slug($teamData['name']),
                'description' => $teamData['description'],
                'owner_id' => $owner->id,
            ]);
        }
    }
}
