/* Rounded, opaque block studies. Motion, picking and palette belong to the Hairline engine. */
(() => {
  const F = window.Forma;
  F.coverRecipes ||= {};
  const R = F.coverRecipes;
  const rule = (S, x, y, w, z, g = -1) => S.line([[x, y, z], [x + w, y, z]], g);
  const dots = (S, x, y, z, n, g = -1) => {
    for (let i = 0; i < n; i++) S.dot(x + i * 4.5, y, z, .75, g);
  };

  R.modal = S => {
    S.box(-58, -40, 116, 80, 0, 4, 6);
    S.rim(-53, -35, 106, 70, 4.2, 4);
    rule(S, -48, -25, 92, 4.3);
    dots(S, -46, -31, 4.3, 3);
    S.line([[-35, -22, 4.4], [-35, -22, 17]], -1, 'dash');
    S.line([[35, 25, 4.4], [35, 25, 17]], -1, 'dash');
    const shell = S.group([0, 0, 20], [0, 0, 3]);
    S.focus(S.box(-37, -26, 74, 54, 17, 3.5, 5, shell));
    rule(S, -28, -14, 36, 20.7, shell);
    S.dot(28, -16, 20.7, 1.1, shell);
    rule(S, -29, -7, 58, 20.7, shell);
    const fields = S.group([-1, 2, 24], [0, 0, 12]);
    S.focus(S.box(-28, -1, 56, 9, 23, 2, 2.5, fields));
    S.rim(-24, 1.5, 34, 4, 25.2, 1.5, fields);
    const actions = S.group([13, 19, 25], [0, 0, 8]);
    S.box(-11, 16, 17, 7, 24, 2, 2.5, actions);
    S.focus(S.box(10, 16, 19, 7, 24, 2, 2.5, actions));
  };

  R['alert-dialog'] = S => {
    S.box(-50, -36, 100, 73, 0, 4, 6);
    S.rim(-45, -31, 90, 63, 4.2, 4);
    const panel = S.group([0, -1, 17], [0, 0, 3]);
    S.focus(S.box(-35, -27, 70, 55, 13, 4, 6, panel));
    S.rim(-29, -21, 58, 43, 17.2, 4, panel);
    const seal = S.group([0, -12, 27], [0, 0, 10]);
    S.focus(S.box(-9, -21, 18, 18, 22, 5, 9, seal));
    S.rim(-5.5, -17.5, 11, 11, 27.2, 5.5, seal);
    dots(S, -4.5, -12, 27.3, 3, seal);
    rule(S, -21, 2, 42, 17.3, panel);
    rule(S, -15, 7, 30, 17.3, panel);
    const quiet = S.group([-15, 20, 23], [-3, 0, 5]);
    S.focus(S.box(-28, 15, 24, 10, 20, 2.5, 3, quiet));
    const commit = S.group([16, 20, 24], [3, 0, 8]);
    S.focus(S.box(4, 15, 24, 10, 21, 3.5, 3, commit));
    S.rim(8, 18, 16, 4, 24.7, 1.5, commit);
  };

  R.drawer = S => {
    S.box(-60, -39, 113, 77, 0, 4, 6);
    S.rim(-55, -34, 103, 67, 4.2, 4);
    dots(S, -49, -28, 4.3, 3);
    rule(S, -51, -20, 96, 4.3);
    for (let i = 0; i < 4; i++) rule(S, -46, -8 + i * 9, 33 - i * 3, 4.3);
    // Two exposed runners hold the tray above the window chassis.
    S.box(-8, -25, 64, 3, 7, 2, 1.2);
    S.box(-8, 23, 64, 3, 7, 2, 1.2);
    const drawer = S.group([35, 0, 16], [13, 0, 3]);
    S.focus(S.box(12, -31, 43, 65, 13, 4, 4, drawer));
    S.rim(17, -26, 33, 55, 17.2, 3, drawer);
    rule(S, 21, -18, 21, 17.3, drawer);
    S.dot(46, -19, 17.3, .9, drawer);
    S.box(20, -8, 27, 10, 17.5, 1.5, 2, drawer);
    S.box(20, 7, 27, 10, 17.5, 1.5, 2, drawer);
    S.rim(32, 22, 15, 5, 17.4, 2, drawer);
  };

  R.card = S => {
    S.box(-41, -43, 79, 83, 0, 3, 6);
    const body = S.group([0, -1, 12], [0, 0, 3]);
    S.focus(S.box(-35, -37, 73, 81, 8, 4, 6, body));
    S.rim(-30, -32, 63, 40, 12.2, 4, body);
    const image = S.group([1, -11, 20], [0, 0, 9]);
    S.focus(S.box(-26, -28, 55, 31, 16, 3, 3, image));
    S.rim(-22, -24, 47, 23, 19.2, 2, image);
    // A miniature arrangement sits within the image well, never a flat icon.
    S.box(-15, -15, 12, 10, 19.4, 3, 2, image);
    S.box(1, -20, 15, 15, 19.4, 6, 3, image);
    rule(S, -26, 17, 45, 12.3, body);
    rule(S, -26, 23, 53, 12.3, body);
    rule(S, -26, 28, 33, 12.3, body);
    const action = S.group([16, 36, 18], [0, 0, 8]);
    S.focus(S.box(4, 33, 24, 7, 16, 2.5, 3, action));
    dots(S, -24, 36, 12.4, 3, body);
  };

  R['data-table'] = S => {
    S.box(-61, -38, 122, 77, 0, 5, 6);
    S.rim(-55, -32, 110, 65, 5.2, 4);
    for (let i = 0; i < 4; i++) rule(S, -54, -11 + i * 13, 108, 5.3);
    for (const x of [-38, 9, 34]) S.line([[x, -30, 5.3], [x, 32, 5.3]]);
    const header = S.group([0, -26, 14], [0, 0, 8]);
    S.focus(S.box(-55, -33, 110, 13, 10, 3.5, 3, header));
    for (const x of [-38, 9, 34]) S.line([[x, -31, 13.7], [x, -22, 13.7]], header);
    rule(S, -30, -26.5, 27, 13.7, header);
    rule(S, 16, -26.5, 12, 13.7, header);
    for (let n = 0; n < 3; n++) {
      const y = -6 + n * 13;
      S.rim(-49, y - 3, 5, 5, 5.4, 1.4);
      rule(S, -30, y, 25 + n * 3, 5.4);
      rule(S, 40, y, 9, 5.4);
      const badge = S.group([22, y, 10 + n], [0, 0, 7 + n]);
      S.focus(S.box(14, y - 3.5, 15, 7, 7 + n, 2, 3.5, badge));
      dots(S, 18, y, 9.2 + n, 2, badge);
    }
  };

  R['file-upload'] = S => {
    S.box(-47, -32, 94, 66, 0, 4, 6);
    S.box(-44, -29, 88, 4, 4, 12, 1.8);
    S.box(-44, -25, 4, 51, 4, 12, 1.8);
    S.rim(-34, -19, 68, 42, 4.2, 3);
    const sheet = S.group([0, -4, 34], [0, 0, -11]);
    S.focus(S.box(-26, -29, 49, 56, 30, 2.2, 4, sheet));
    S.rim(-20, -23, 37, 44, 32.4, 2, sheet);
    S.box(-17, -20, 14, 10, 32.5, 1.5, 2, sheet);
    rule(S, -17, -3, 28, 32.6, sheet);
    rule(S, -17, 4, 34, 32.6, sheet);
    rule(S, -17, 11, 23, 32.6, sheet);
    dots(S, -16, 17, 32.6, 3, sheet);
    // Near walls mask the rear of the resting document as it settles.
    S.box(40, -25, 4, 51, 4, 12, 1.8);
    S.box(-44, 26, 88, 5, 4, 12, 2);
    const lip = S.group([0, 29, 18], [0, 0, 4]);
    S.focus(S.box(-14, 27, 28, 5, 16, 2, 2, lip));
  };

  R['empty-state'] = S => {
    // An open cabinet: a visible interior, one shelf and an offset door.
    S.box(-42, -28, 81, 61, 0, 5, 5);
    S.box(-39, -25, 75, 4, 5, 37, 2);
    S.box(-39, -21, 4, 48, 5, 37, 1.8);
    S.rim(-31, -17, 59, 39, 5.2, 3);
    const shelf = S.group([-2, 3, 23], [0, 8, 3]);
    S.focus(S.box(-31, -18, 59, 42, 20, 2.5, 2.5, shelf));
    S.rim(-26, -13, 49, 32, 22.7, 2, shelf);
    rule(S, -16, 19, 20, 22.8, shelf);
    S.box(32, -21, 4, 48, 5, 37, 1.8);
    S.box(-39, -25, 75, 5, 42, 3, 2);
    S.box(-39, 22, 75, 5, 42, 3, 2);
    const door = S.group([44, 19, 20], [9, 4, 0]);
    S.focus(S.box(40, 5, 4, 34, 5, 33, 1.8, door));
    S.line([[44.2, 12, 10], [44.2, 31, 10], [44.2, 31, 33], [44.2, 12, 33]], door);
    S.box(44, 25, 3, 7, 20, 3, 1.2, door);
    dots(S, -29, 30, 5.3, 3);
  };

  R['action-bar'] = S => {
    S.box(-56,-30,112,60,0,4,6);
    for(let n=0;n<3;n++){S.rim(-47,-22+n*16,8,8,4.2,2);rule(S,-32,-18+n*16,66,4.3);}
    const g=S.group([0,27,18],[0,0,8]);
    S.focus(S.box(-48,17,96,22,16,4,11,g));
    S.rim(-39,23,10,10,20.2,5,g);rule(S,-23,28,28,20.3,g);
    S.box(15,23,23,10,20.2,1,5,g);
  };
  R.toast = S => {
    S.box(-56, -39, 112, 78, 0, 4, 6);
    S.rim(-51, -34, 102, 68, 4.2, 4);
    rule(S, -44, -22, 78, 4.3);
    rule(S, -44, -12, 45, 4.3);
    rule(S, -44, -3, 61, 4.3);
    // Overlapping notices emerge from one corner, each with its own lift.
    const stack = [
      {x: -5, y: 6, z: 9, w: 49, d: 12, lift: 3},
      {x: -9, y: 17, z: 15, w: 56, d: 15, lift: 6},
      {x: -16, y: 29, z: 24, w: 66, d: 18, lift: 10}
    ];
    for (const [n, t] of stack.entries()) {
      const g = S.group([t.x + t.w / 2, t.y + t.d / 2, t.z + 3], [0, 0, t.lift]);
      S.focus(S.box(t.x, t.y, t.w, t.d, t.z, 3, 3.5, g));
      S.rim(t.x + 5, t.y + 4, t.d - 8, t.d - 8, t.z + 3.2, 2, g);
      rule(S, t.x + t.d + 1, t.y + t.d / 2 - 1, t.w - t.d - 12, t.z + 3.3, g);
      if (n === 2) rule(S, t.x + t.d + 1, t.y + 12, 24, t.z + 3.3, g);
      S.dot(t.x + t.w - 5, t.y + t.d / 2, t.z + 3.3, .8, g);
    }
  };

  R['filter-bar'] = S => {
    S.box(-60, -34, 120, 73, 0, 4, 6);
    S.rim(-54, -28, 108, 61, 4.2, 4);
    for (let n = 0; n < 3; n++) {
      const y = 4 + n * 11;
      rule(S, -45, y, 44 + n * 5, 4.3);
      S.rim(22, y - 3, 21, 6, 4.3, 2.5);
    }
    const search = S.group([-25, -18, 13], [0, 0, 8]);
    S.focus(S.box(-51, -26, 53, 15, 10, 3, 4, search));
    S.rim(-46, -22, 7, 7, 13.2, 3.5, search);
    rule(S, -33, -18.5, 27, 13.3, search);
    for (let n = 0; n < 2; n++) {
      const x = 10 + n * 24, z = 13 + n * 3;
      const g = S.group([x + 9, -18, z + 3], [0, 0, 7 + n * 2]);
      S.focus(S.box(x, -25, 19, 14, z, 3, 4, g));
      dots(S, x + 5, -18, z + 3.3, n + 2, g);
    }
  };

  R.stepper = S => {
    S.box(-61, -11, 122, 31, 0, 4, 6);
    S.rim(-55, -5, 110, 19, 4.2, 4);
    const steps = [{x: -43, z: 10}, {x: -13, z: 18}, {x: 17, z: 27}, {x: 47, z: 37}];
    // Joining rails are painted first, beneath each lifted stage.
    for (let n = 0; n < steps.length - 1; n++) {
      const a = steps[n], b = steps[n + 1];
      S.line([[a.x, 3, a.z], [b.x, 3, b.z]], -1, 'dash');
    }
    for (const [n, p] of steps.entries()) {
      S.box(p.x - 7, -4, 14, 14, 4, 2 + n * 2, 3);
      const g = S.group([p.x, 3, p.z + 4], [0, 0, 7]);
      S.focus(S.box(p.x - 10, -7, 20, 20, p.z, 4, 7, g));
      S.rim(p.x - 6, -3, 12, 12, p.z + 4.2, 4, g);
      for (let k = 0; k <= n; k++) S.dot(p.x - n * 1.5 + k * 3, 3, p.z + 4.4, .65, g);
    }
  };

  R.chart = S => {
    S.box(-59, -25, 118, 55, 0, 5, 5);
    S.rim(-53, -19, 106, 43, 5.2, 3);
    for (let i = 0; i < 4; i++) rule(S, -51, -14 + i * 10, 102, 5.3);
    const heights = [12, 23, 18, 34, 27, 43, 36];
    for (const [n, h] of heights.entries()) {
      const x = -49 + n * 15;
      const g = S.group([x + 5, 2, h + 5], [0, 0, 7]);
      S.focus(S.box(x, -8, 10, 20, 5, h, 2.5, g));
      S.rim(x + 2.5, -5, 5, 14, h + 5.2, 1.5, g);
      S.dot(x + 5, 3, h + 5.35, .65, g);
    }
    for (let n = 0; n < 7; n++) S.dot(-44 + n * 15, 20, 5.4, .8);
  };

  R['avatar-group'] = S => {
    S.box(-53, -22, 106, 47, 0, 4, 6);
    S.rim(-46, -15, 92, 33, 4.2, 5);
    // Offset identity medallions share a rail, with differently punched centres.
    const people = [
      {x: -36, y: -3, z: 10, lift: .75}, {x: -16, y: -2, z: 16, lift: .9},
      {x: 5, y: 1, z: 22, lift: 2}, {x: 27, y: 4, z: 29, lift: 8}
    ];
    for (const [n, p] of people.entries()) {
      const g = S.group([p.x, p.y, p.z + 5], [0, 0, p.lift]);
      S.focus(S.box(p.x - 14, p.y - 14, 28, 28, p.z, 5, 14, g));
      S.rim(p.x - 10, p.y - 10, 20, 20, p.z + 5.2, 10, g);
      S.box(p.x - 5, p.y - 5, 10, 10, p.z + 5.4, 1.5, 4, g);
      for (let k = 0; k <= n; k++) S.dot(p.x - n * 1.5 + k * 3, p.y, p.z + 7.1, .65, g);
    }
  };
})();
