export const queue = new sst.aws.Queue("queue", { fifo: true });
queue.subscribe("packages/queues/src/mailer.sendMail");
