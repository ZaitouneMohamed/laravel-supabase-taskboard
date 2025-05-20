<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\BoardType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        $this->call(BoardTypeSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(TeamUserSeeder::class);
    }
}
