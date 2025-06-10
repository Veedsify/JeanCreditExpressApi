import { Request, Response } from 'express';

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Public
 */

async function AllUsers(_req: Request, res: Response) {
    res.status(200).json({
        message: 'All users fetched successfully',
    });
}

export { AllUsers };