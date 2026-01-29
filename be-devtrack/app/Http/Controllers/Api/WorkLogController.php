<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkLog;
use App\Models\Issue;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Work Logs",
 *     description="Work log endpoints"
 * )
 */
class WorkLogController extends Controller
{
    /**
     * Get work logs for an issue
     * 
     * @OA\Get(
     *     path="/api/issues/{issueId}/work-logs",
     *     operationId="getWorkLogs",
     *     tags={"Work Logs"},
     *     summary="Get work logs for issue",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="issueId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Work logs list"
     *     )
     * )
     */
    public function index(Issue $issue)
    {
        return response()->json($issue->workLogs()->with('user')->get());
    }

    /**
     * Add work log to issue
     * 
     * @OA\Post(
     *     path="/api/issues/{issueId}/work-logs",
     *     operationId="createWorkLog",
     *     tags={"Work Logs"},
     *     summary="Add work log",
     *     description="Assigned engineer can log work on the issue",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="issueId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"hours","logged_at"},
     *             @OA\Property(property="hours", type="number", format="decimal", example=4.5),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="logged_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Work log created"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Only assigned engineer can log work"
     *     )
     * )
     */
    public function store(Request $request, Issue $issue)
    {
        $user = $request->user();

        // Only assigned engineer can log work
        if ($user->id !== $issue->assigned_to) {
            return response()->json(['message' => 'Only assigned engineer can log work'], 403);
        }

        $validated = $request->validate([
            'hours' => 'required|numeric|min:0.25',
            'description' => 'nullable|string',
            'logged_at' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $workLog = $issue->workLogs()->create([
            'user_id' => $user->id,
            'hours' => $validated['hours'],
            'description' => $validated['description'] ?? null,
            'logged_at' => $validated['logged_at'],
        ]);

        return response()->json([
            'message' => 'Work log created successfully',
            'work_log' => $workLog->load('user'),
        ], 201);
    }

    /**
     * Get work log details
     * 
     * @OA\Get(
     *     path="/api/work-logs/{id}",
     *     operationId="getWorkLogById",
     *     tags={"Work Logs"},
     *     summary="Get work log details",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Work log details"
     *     )
     * )
     */
    public function show(WorkLog $workLog)
    {
        return response()->json($workLog->load('user', 'issue'));
    }

    /**
     * Update work log
     * 
     * @OA\Put(
     *     path="/api/work-logs/{id}",
     *     operationId="updateWorkLog",
     *     tags={"Work Logs"},
     *     summary="Update work log",
     *     description="User who logged work can update it",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="hours", type="number"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="logged_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Work log updated"
     *     )
     * )
     */
    public function update(Request $request, WorkLog $workLog)
    {
        if ($request->user()->id !== $workLog->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'hours' => 'sometimes|numeric|min:0.25',
            'description' => 'nullable|string',
            'logged_at' => 'sometimes|date_format:Y-m-d H:i:s',
        ]);

        $workLog->update($validated);

        return response()->json([
            'message' => 'Work log updated successfully',
            'work_log' => $workLog,
        ]);
    }

    /**
     * Delete work log
     * 
     * @OA\Delete(
     *     path="/api/work-logs/{id}",
     *     operationId="deleteWorkLog",
     *     tags={"Work Logs"},
     *     summary="Delete work log",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Work log deleted"
     *     )
     * )
     */
    public function destroy(Request $request, WorkLog $workLog)
    {
        if ($request->user()->id !== $workLog->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $workLog->delete();

        return response()->json(['message' => 'Work log deleted successfully']);
    }
}
