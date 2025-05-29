<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\InertiaBaseController;
use App\Http\Requests\Team\StoreTeamRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Http\Resources\Team\TeamCollection;
use App\Models\Team;

class TeamController extends InertiaBaseController
{
    protected $model = Team::class;
    protected $routeName = "team.index";
    protected $storeRequestClass = StoreTeamRequest::class;
    protected $updateRequestClass = UpdateTeamRequest::class;
    protected $CollectionClass = TeamCollection::class;
    protected $folderPath = "teams";
}
