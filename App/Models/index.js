import mongoose from 'mongoose';

import rounds from './Schemas/rounds';


mongoose.model('round', rounds);
