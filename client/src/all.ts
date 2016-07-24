import {bootstrap} from '@angular/platform-browser-dynamic';
import {Component} from '@angular/core';

@Component({
  selector: 'app',
  template: '<h2>Hello, {{name}}! Welcome to Angular2</h2>'
})
class App {
  name: string = 'otiai10'
}

bootstrap(App);
