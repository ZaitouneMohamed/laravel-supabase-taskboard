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

    function returnBackWithSuccess($message = "response with ok" , $data = [])
    {
        return redirect()->back()->with('success', $message)->with('data', $data);
    }

    function returnBackWithError($message = "please try again" , $data = [])
    {
        return redirect()->back()->with('error', $message)->with('data', $data);
    }
}
