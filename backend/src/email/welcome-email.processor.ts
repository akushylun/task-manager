import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, UnrecoverableError } from 'bullmq';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';

// Shape of what AuthService.create puts on the queue.
type WelcomeEmailJobData = {
  userId: number;
};

// Stands in for a real mail provider. No SMTP in this ticket — the point is
// that the work is slow, so the signup response visibly does not wait for it.
const SEND_LATENCY_MS = 3000;

@Processor('welcome-email')
export class WelcomeEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(WelcomeEmailProcessor.name);

  constructor(@InjectRepository(User) private repo: Repository<User>) {
    super();
  }

  async process(job: Job<WelcomeEmailJobData>): Promise<void> {
    const userId = job.data.userId;
    const user = await this.repo.findOneBy({ id: userId });

    // The job is only enqueued after the signup transaction commits, so a
    // missing user means the account was deleted — not that it is not visible
    // yet. Retrying cannot fix that, so fail the job for good instead of
    // burning all three attempts on it.
    if (!user) {
      throw new UnrecoverableError(`User ${userId} was not found`);
    }

    this.logger.log(`Sending welcome email to ${user.email} (job ${job.id})`);
    await new Promise((resolve) => setTimeout(resolve, SEND_LATENCY_MS));
    this.logger.log(`Welcome email sent to ${user.email} (job ${job.id})`);
  }
}
