import express from 'express';
import { addKid, getKidsOf, callKid } from './kids.js';
import { validateAddingKid, validateGetKidsOf, validateCall } from './validators.js';

export const router = express.Router();

router.post('/', validateAddingKid, addKid);

router.get('/:id', validateGetKidsOf, getKidsOf);

router.post('/:id/call', validateCall, callKid);