import { Router, type Request, type Response } from "express";
import { queue } from "./queue";

const router = Router();

router.get("/submit", async (_req: Request, res: Response) => {
  try {
    let lastJob;

    for (let i = 0; i < 100; i++) {
      lastJob = await queue.add("calculatePrimes", { limit: 100000 });
    }

    res.json({
      jobId: lastJob?.id,
      message: "Jobs submitted successfully",
    });
  } catch (err) {
    console.error("Error submitting job:", err);
    res.status(500).json({ error: "Failed to submit job" });
  }
});

router.get("/status/:id", async (req: Request, res: Response) => {
  try {
    const job = await queue.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;

    res.json({ state, progress, result });
  } catch (err) {
    console.error("Error fetching job status:", err);
    res.status(500).json({ error: "Failed to fetch job status" });
  }
});

export default router;
