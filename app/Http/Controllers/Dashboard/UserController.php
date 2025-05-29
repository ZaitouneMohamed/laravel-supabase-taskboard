<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\InertiaBaseController;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Resources\User\UserCollection;
use App\Models\User;

class UserController extends InertiaBaseController
{
    protected $model = User::class;
    protected $routeName = "user.index";
    protected $folderPath = "users";
    protected $CollectionClass = UserCollection::class;
    protected $storeRequestClass = StoreUserRequest::class;
}
