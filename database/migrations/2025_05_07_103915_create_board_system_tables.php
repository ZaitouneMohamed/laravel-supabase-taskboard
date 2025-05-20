<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Board Types Table
        Schema::create('board_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Teams Table (if not already exists)
        if (!Schema::hasTable('teams')) {
            Schema::create('teams', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
                $table->text('description')->nullable();
                $table->string('avatar')->nullable();
                $table->timestamps();
            });
        }

        Schema::create('team_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['owner', 'admin', 'member', 'viewer'])->default('member');
            $table->timestamps();

            // Unique constraint to prevent duplicate team-user relationships
            $table->unique(['team_id', 'user_id']);
        });
        // Boards Table
        Schema::create('boards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'draft', 'archived'])->default('active');
            $table->foreignId('type_id')->constrained('board_types');
            $table->foreignId('creator_id')->constrained('users');
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->boolean('is_private')->default(false);
            $table->json('settings')->nullable();
            $table->string('template_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for common queries
            $table->index(['status', 'created_at']);
            $table->index(['team_id', 'status']);
            $table->index(['creator_id', 'status']);
        });

        // Board Items Table
        Schema::create('board_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->foreignId('creator_id')->constrained('users');
            $table->string('title');
            $table->text('content')->nullable();
            $table->integer('position')->default(0);
            $table->integer('votes')->default(0);
            $table->string('status')->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['board_id', 'position']);
            $table->index(['board_id', 'status']);
        });

        // Board Comments Table
        Schema::create('board_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
            $table->softDeletes();
        });

        // Board Members Table
        Schema::create('board_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['owner', 'admin', 'member', 'viewer'])->default('member');
            $table->timestamps();

            // Unique constraint to prevent duplicate members
            $table->unique(['board_id', 'user_id']);
        });

        // Board Item Votes Table
        Schema::create('board_item_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('vote')->default(1); // 1 = upvote, -1 = downvote
            $table->timestamps();

            // Unique constraint to prevent duplicate votes
            $table->unique(['board_item_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_item_votes');
        Schema::dropIfExists('board_members');
        Schema::dropIfExists('board_comments');
        Schema::dropIfExists('board_items');
        Schema::dropIfExists('boards');
        Schema::dropIfExists('board_types');
    }
};
