import { base44 } from '@/api/base44Client';

const createEntity = (name) => ({
  list: (...args) => base44.entities[name].list(...args),
  get: (...args) => base44.entities[name].get(...args),
  create: (data) => base44.entities[name].create(data),
  update: (id, data) => base44.entities[name].update(id, data),
  delete: (id) => base44.entities[name].delete(id),
  filter: (...args) => base44.entities[name].filter(...args),
});

export const Quiz = createEntity("Quiz");
export const QuizAttempt = createEntity("QuizAttempt");
export const User = base44.auth;