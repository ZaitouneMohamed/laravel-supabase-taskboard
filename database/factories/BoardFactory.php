<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\BoardType;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Board>
 */
class BoardFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Board::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ,
            'team_id' => null,
            'type_id' => BoardType::inRandomOrder()->first()?->id ,
            'name' => fake()->catchPhrase(),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['active', 'draft', 'archived']),
            'is_private' => fake()->boolean(20), // 20% chance of being private
            'settings' => json_encode([
                'enable_voting' => fake()->boolean(80), // 80% chance of being enabled
                'allow_comments' => fake()->boolean(90), // 90% chance of being enabled
                'show_creator' => fake()->boolean(70), // 70% chance of being enabled
            ]),
        ];
    }

    /**
     * Indicate that the board is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the board is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the board is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }

    /**
     * Indicate that the board is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_private' => true,
        ]);
    }

    /**
     * Indicate that the board is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_private' => false,
        ]);
    }

    /**
     * Indicate that the board belongs to a team.
     */
    public function forTeam(Team $team = null): static
    {
        return $this->state(fn (array $attributes) => [
            'team_id' => $team?->id ?? Team::factory(),
        ]);
    }
}
