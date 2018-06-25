// import { UserService } from './user.service';
// import { User } from '../../../models/user.model';
// import { Apollo } from 'apollo-angular';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-angular-link-http';
// import { HttpClient } from '@angular/common/http';

// describe('dashboard component', () => {
//     let userService: UserService;
//     let httpLink: HttpLink; //  = new HttpLink(new HttpTestClient());

//     beforeEach(async () => {
//         userService = new UserService(new Apollo());
//        const http = httpLink.create({ uri: '../../../mocks/assets/users.json' });
//         this.apollo.create({
//           link: http,
//           cache: new InMemoryCache(),
//         });

//     });

//     it('who knows ...', () => {
//       const result = userService.getAllUsers();
//       expect(null).toBeNull();
//     });
// });
