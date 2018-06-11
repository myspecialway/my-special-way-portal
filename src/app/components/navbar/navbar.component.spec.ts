import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';
import { Shallow } from 'shallow-render';
import { ComponentsModule } from '../components.module';

describe('dashboard component', () => {
  let shallow: Shallow<NavbarComponent>;
  beforeEach(async () => {
    shallow = new Shallow(NavbarComponent, ComponentsModule);

  });

  it('should render link1 and link2 as paths in the navbar', async () => {
    const component = await shallow.render('<app-navbar></app-navbar>');
    const linkElements = component.find('[data-test-id="header"] a');

    expect(linkElements.length).toBe(3);
  });
});
