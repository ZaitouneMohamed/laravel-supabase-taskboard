<?php

namespace App\Http\Controllers;

abstract class Controller
{
    function errorJsonResponse($statusCode = 401 , $message = "please try again")
    {
        return response()->json([
            "error" => $message
        ],$statusCode);
    }

    function successJsonResponse($statusCode = 200 , $message = "response with ok" , $data = [])
    {
        return response()->json([
            "success" => $message,
            "data" => $data
        ],$statusCode);
    }
}
