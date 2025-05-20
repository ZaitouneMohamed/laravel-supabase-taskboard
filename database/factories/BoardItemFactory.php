<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\BoardItems;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BoardItem>
 */
class BoardItemsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BoardItems::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'board_id' => fake()->randomNumber(1 , 10),
            'user_id' => fake()->randomNumber(1 , 10),
            'title' => fake()->sentence(),
            'description' => fake()->paragraphs(2, true),
            'status' => fake()->randomElement(['open', 'in_progress', 'completed', 'archived']),
            'order' => fake()->numberBetween(0, 100),
            'votes' => fake()->numberBetween(0, 50),
            'metadata' => [
                'due_date' => fake()->boolean(30) ? fake()->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d') : null,
                'priority' => fake()->randomElement(['low', 'medium', 'high', null]),
                'tags' => fake()->boolean(70) ? fake()->words(fake()->numberBetween(1, 3)) : [],
            ],
        ];
    }

    /**
     * Indicate that the board item is open.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
        ]);
    }

    /**
     * Indicate that the board item is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Indicate that the board item is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Indicate that the board item is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }

    /**
     * Indicate that the board item has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'metadata' => array_merge($attributes['metadata'] ?? [], ['priority' => 'high']),
        ]);
    }

    /**
     * Set specific tags for the board item.
     */
    public function withTags(array $tags): static
    {
        return $this->state(fn (array $attributes) => [
            'metadata' => array_merge($attributes['metadata'] ?? [], ['tags' => $tags]),
        ]);
    }
}
