import { Cat } from './cat.model';

// This may actually belong in a shared module if it is THE user interface and not just a user within the comms domain
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
}
