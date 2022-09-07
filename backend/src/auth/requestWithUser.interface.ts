import { Request } from 'express';
import { UsersPost } from 'src/users/models/users.interface';
 
interface RequestWithUser extends Request {
  user: UsersPost;
}
 
export default RequestWithUser;