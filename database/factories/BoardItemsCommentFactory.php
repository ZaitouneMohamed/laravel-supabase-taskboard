<?php

namespace Database\Factories;

use App\Models\BoardItem;
use App\Models\BoardItemComment;
use App\Models\BoardItemsComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BoardItemComment>
 */
class BoardItemCommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BoardItemsComment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'board_item_id' => fake()->randomNumber(1 , 10),
            'user_id' => User::factory(),
            'content' => fake()->paragraph(),
            'parent_id' => null,
        ];
    }

    /**
     * Indicate that the comment is a reply to another comment.
     */
    public function asReply(BoardItemsComment $parent = null): static
    {
        return $this->state(function (array $attributes) use ($parent) {
            // If a parent comment is provided, use it; otherwise create a new parent comment
            $parentComment = $parent ?? BoardItemsComment::factory()->create([
                'board_item_id' => $attributes['board_item_id']
            ]);

            return [
                'parent_id' => $parentComment->id,
                'board_item_id' => $parentComment->board_item_id,
            ];
        });
    }
}
