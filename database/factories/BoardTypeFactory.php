<?php

namespace Database\Factories;

use App\Models\BoardType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BoardType>
 */
class BoardTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BoardType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(),
            'icon' => fake()->randomElement(['clipboard-list', 'view-boards', 'map', 'calendar', 'light-bulb', 'chart-bar']),
            'default_settings' => [
                'enable_voting' => fake()->boolean(80),
                'allow_comments' => fake()->boolean(90),
                'show_creator' => fake()->boolean(70),
            ],
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the board type is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
