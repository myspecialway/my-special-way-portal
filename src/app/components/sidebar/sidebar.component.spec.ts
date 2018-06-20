import { SidebarComponent } from './sidebar.component';
import { By } from '@angular/platform-browser';
import { Shallow } from 'shallow-render';
import { ComponentsModule } from '../components.module';

describe('dashboard component', () => {
  let shallow: Shallow<SidebarComponent>;
  beforeEach(async () => {
    shallow = new Shallow(SidebarComponent, ComponentsModule);

  });

  it('should render link1 and link2 as paths in the sidebar', async () => {
    const component = await shallow.render('<app-sidebar></app-sidebar>');
    const liElements = component.find('[data-test-id="iterable-nav-links"] li');
    const iconsElement = liElements[0].query(By.css('.material-icons'));

    expect(liElements.length).toBe(3);
    // expect(iconsElement.nativeElement.innerHTML).toBe('school');
  });
});
