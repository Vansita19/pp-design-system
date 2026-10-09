/* Molecule covers: physical mechanisms built with the shared Hairline scene DSL. */
(() => {
  const R = F.coverRecipes || (F.coverRecipes = {});
  const punches = (S, x, y, z, n, g) => {
    for (let i = 0; i < n; i++) S.dot(x + i * 3.5, y, z, .75, g);
  };

  R.field = function (S) {
    const entry = S.group([0, 4, 19], [0, 0, 9]);
    const label = S.group([-25, -23, 10], [0, -2, 5]);
    const helper = S.group([-23, 26, 8], [2, 0, 4]);
    S.box(-56, -35, 112, 73, 0, 4, 6);
    S.rim(-51, -30, 102, 63, 4.2, 4);
    const tag = S.box(-44, -29, 38, 10, 5, 3, 3, label);
    S.rim(-40, -26, 20, 4, 8.1, 1, label);
    S.line([[-43, -12, 4.5], [43, -12, 4.5]], -1, 'lo');
    const field = S.box(-45, -10, 90, 29, 8, 10, 5, entry);
    S.rim(-39, -4, 65, 17, 18.2, 3, entry);
    S.box(32, -3, 5, 15, 18, 1.5, 1.5, entry);
    punches(S, -32, 3, 18.4, 4, entry);
    const foot = S.box(-43, 25, 44, 6, 5, 2, 2, helper);
    S.line([[-39, 28, 7.2], [-17, 28, 7.2]], helper);
    S.focus(field); S.focus(tag); S.focus(foot);
  };

  R.select = function (S) {
    const body = S.group([-9, 0, 17], [0, 0, 7]);
    const actuator = S.group([40, 0, 25], [0, 0, 10]);
    const receipt = S.group([-16, -26, 11], [-5, -3, 6]);
    S.box(-58, -34, 116, 66, 0, 5, 7);
    S.rim(-52, -28, 104, 54, 5.2, 5);
    const tail = S.box(-39, -29, 54, 14, 6, 3, 3, receipt);
    punches(S, -30, -22, 9.2, 3, receipt);
    const socket = S.box(-48, -12, 96, 35, 8, 9, 5, body);
    S.rim(-41, -6, 62, 22, 17.2, 3, body);
    S.box(-35, -1, 38, 11, 17.3, 1.5, 2, body);
    S.line([[27, -6, 17.2], [27, 16, 17.2]], body);
    const plunger = S.box(33, -5, 13, 20, 18, 7, 5, actuator);
    S.rim(36, -1, 7, 12, 25.2, 3, actuator);
    S.focus(plunger); S.focus(socket); S.focus(tail);
  };

  R.combobox = function (S) {
    const search = S.group([0, -25, 29], [0, -2, 7]);
    const rows = [0, 1, 2].map(i => S.group([i * 3, -1 + i * 17, 13 - i * 2], [3, 2, 6 + i]));
    S.box(-54, -41, 108, 84, 0, 4, 6);
    S.rim(-48, -36, 96, 73, 4.2, 4);
    S.line([[-44, -12, 5], [-44, 35, 5]], -1, 'lo');
    S.line([[46, -12, 5], [46, 35, 5]], -1, 'lo');
    const rail = S.box(-46, -36, 92, 22, 18, 8, 5, search);
    S.rim(-40, -31, 61, 12, 26.2, 3, search);
    S.box(27, -31, 11, 12, 26, 2, 5, search);
    S.rim(30, -28, 5, 6, 28.2, 2, search);
    const leaves = [];
    for (let i = 0; i < 3; i++) {
      const x = -42 + i * 3, y = -8 + i * 17, z = 12 - i * 3, g = rows[i];
      const leaf = S.box(x, y, 81, 13, z, 3, 3, g); leaves.push(leaf);
      S.rim(x + 6, y + 3, 12, 7, z + 3.2, 2, g);
      S.line([[x + 26, y + 6.5, z + 3.3], [x + 62 - i * 8, y + 6.5, z + 3.3]], g);
      punches(S, x + 69, y + 6.5, z + 3.3, 2, g);
    }
    S.focus(leaves[0]); S.focus(rail); S.focus(leaves[1]); S.focus(leaves[2]);
  };

  R.multiselect = function (S) {
    const specs = [[-39, -20, 5], [-4, -19, 10], [27, -17, 6], [-21, 14, 17]];
    const groups = specs.map(([x, y, z]) => S.group([x + 12, y + 9, z + 8], [0, 0, 7]));
    S.box(-54, -34, 111, 72, 0, 5, 6);
    S.rim(-48, -28, 99, 60, 5.2, 5);
    S.line([[-44, 7, 5.3], [47, 7, 5.3]], -1, 'lo');
    const chips = [];
    [0, 1, 3, 2].forEach(i => {
      const [x, y, z] = specs[i], g = groups[i];
      const chip = S.box(x, y, 25, 19, z + 3, 5, 5, g); chips[i] = chip;
      S.rim(x + 4, y + 4, 17, 11, z + 8.2, 3, g);
      punches(S, x + 7, y + 9.5, z + 8.3, i + 1, g);
    });
    S.rim(17, 15, 26, 17, 5.3, 4);
    S.line([[21, 23.5, 5.4], [39, 23.5, 5.4]], -1, 'lo');
    S.focus(chips[3]); S.focus(chips[0]); S.focus(chips[1]); S.focus(chips[2]);
  };

  R.dropdown = function (S) {
    const head = S.group([-12, -27, 35], [0, -2, 7]);
    const options = [0, 1, 2].map(i => S.group([0, -2 + i * 16, 16 - i * 3], [5, 0, 5]));
    S.box(-50, -39, 100, 82, 0, 4, 6);
    S.rim(-44, -34, 88, 71, 4.2, 4);
    S.line([[-34, -21, 5], [-34, -21, 23]], -1, 'dash');
    const trigger = S.box(-38, -35, 63, 20, 25, 7, 5, head);
    S.rim(-32, -30, 38, 10, 32.2, 3, head);
    S.box(13, -29, 6, 8, 32, 2, 2, head);
    const trays = [];
    for (let i = 0; i < 3; i++) {
      const y = -9 + i * 16, z = 13 - i * 3, g = options[i];
      const shelf = S.box(-39, y, 79, 13, z, 3, 3, g); trays.push(shelf);
      S.box(-33, y + 3, 7, 7, z + 3, 1.5, 2, g);
      S.line([[-18, y + 6.5, z + 3.3], [20 - i * 5, y + 6.5, z + 3.3]], g);
      S.dot(32, y + 6.5, z + 3.3, .8, g);
    }
    S.focus(trays[1]); S.focus(trigger); S.focus(trays[0]); S.focus(trays[2]);
  };

  R.tooltip = function (S) {
    const trigger = S.group([4, 12, 12], [0, 0, 5]);
    const bubble = S.group([0, -11, 40], [0, -3, 6]);
    const rest = S.group([-33, 14, 8], [0, 0, 4]);
    S.box(-46, -22, 91, 57, 0, 4, 7);
    S.rim(-40, -16, 79, 45, 4.2, 5);
    S.line([[4, 9, 9], [4, 9, 22], [0, -8, 34]], bubble, 'dash');
    const spare = S.box(-36, 7, 15, 15, 5, 3, 5, rest);
    S.rim(-32, 11, 7, 7, 8.2, 3, rest);
    const key = S.box(-8, 3, 26, 23, 6, 7, 7, trigger);
    S.rim(-2, 9, 14, 11, 13.2, 5, trigger);
    const cap = S.box(-39, -24, 77, 20, 35, 5, 8, bubble);
    S.rim(-33, -19, 65, 10, 40.2, 4, bubble);
    punches(S, -10, -14, 40.4, 6, bubble);
    S.focus(cap); S.focus(key); S.focus(spare);
  };

  R['command-menu']=function(S){
    const search=S.group([0,-31,10],[0,-2,6]);
    S.box(-54,-46,108,92,0,4,9);S.rim(-49,-41,98,82,4.2,6);
    const field=S.box(-45,-37,90,12,7,3,3,search);
    S.rim(-39,-34,6,6,10.2,3,search);S.line([[-29,-31,10.3],[28,-31,10.3]],search);
    S.line([[-45,-19,4.3],[45,-19,4.3]]);
    [-12,5,22].forEach((y,index)=>{
      const row=S.group([0,y+6,10],[index===0?3:0,0,6+index]);
      const plate=S.box(-45,y,90,12,7,3,3,row);
      S.rim(-39,y+3,6,6,10.2,2,row);S.line([[-27,y+6,10.3],[18,y+6,10.3]],row);
      if(index===0)S.line([[33,y+3,10.3],[37,y+6,10.3],[33,y+9,10.3]],row);
      S.focus(plate);
    });
    S.focus(field);
  };
  R.popover = function (S) {
    const panel = S.group([0, -7, 28], [3, -3, 8]);
    const trigger = S.group([28, 32, 11], [0, 1, 5]);
    const control = panel;
    S.box(-53, -39, 111, 84, 0, 4, 7);
    S.rim(-47, -33, 99, 72, 4.2, 5);
    S.line([[29, 31, 5], [29, 31, 15], [21, 14, 20]], panel, 'dash');
    const shell = S.box(-44, -33, 87, 56, 21, 6, 6, panel);
    S.rim(-38, -27, 75, 44, 27.2, 4, panel);
    S.line([[-36, -17, 27.3], [33, -17, 27.3]], panel);
    punches(S, -32, -22, 27.4, 3, panel);
    const slider = S.box(-32, -9, 47, 10, 28, 4, 3, control);
    S.rim(-27, -6, 24, 4, 32.2, 1.5, control);
    S.box(5, -7, 6, 6, 32, 3, 2, control);
    S.box(-32, 7, 27, 6, 28, 2, 2, panel);
    S.box(11, 6, 20, 9, 28, 3, 3, panel);
    const key = S.box(12, 30, 34, 11, 6, 5, 4, trigger);
    S.rim(17, 33, 24, 5, 11.2, 2, trigger);
    S.focus(shell); S.focus(key);
  };

  R.tabs = function (S) {
    const groups = [0, 1, 2].map(i => S.group([i * 4, i * 4, 11 + i * 10], [0, -3, 5 + i * .3]));
    S.box(-56, -39, 112, 82, 0, 4, 7);
    S.rim(-50, -33, 100, 70, 4.2, 5);
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const x = -46 + i * 3, y = -24 + i * 5, z = 6 + i * 9, g = groups[i];
      const tabX = x + 3 + i * 26;
      S.box(tabX, y - 12, 23, 16, z, 3, 4, g);
      punches(S, tabX + 7, y - 6, z + 3.2, i + 1, g);
      const card = S.box(x, y, 90, 52, z, 3, 5, g); cards.push(card);
      S.rim(x + 6, y + 6, 78, 40, z + 3.2, 3, g);
      S.line([[x + 12, y + 16, z + 3.3], [x + 72, y + 16, z + 3.3]], g);
      S.rim(x + 12, y + 24, 22, 15, z + 3.3, 2, g);
    }
    S.focus(cards[2]); S.focus(cards[0]); S.focus(cards[1]);
  };

  R.breadcrumb = function (S) {
    const route = [[-42, -27, 6], [-17, -10, 12], [10, 7, 18], [36, 23, 25]];
    const groups = route.map(([x, y, z]) => S.group([x + 2, y + 1, z + 5], [0, 0, 5]));
    S.box(-61, -42, 122, 86, 0, 3, 7);
    for (let i = 0; i < route.length - 1; i++) {
      const [x, y, z] = route[i], [nx, ny, nz] = route[i + 1];
      S.line([[x + 10, y + 1, z + 3], [nx - 10, ny + 1, nz + 3]], -1, 'lo');
      S.line([[x + 10, y + 5, z + 3], [nx - 10, ny + 5, nz + 3]], -1, 'lo');
    }
    const steps = [];
    route.forEach(([x, y, z], i) => {
      const g = groups[i], step = S.box(x - 10, y - 8, 23, 19, z, 5, 5, g); steps.push(step);
      S.rim(x - 6, y - 4, 15, 11, z + 5.2, 3, g);
      punches(S, x - 3, y + 1.5, z + 5.4, i + 1, g);
    });
    S.focus(steps[3]); S.focus(steps[0]); S.focus(steps[1]); S.focus(steps[2]);
  };

  R.pagination = function (S) {
    const groups = [0, 1, 2, 3, 4].map(i => S.group([-44 + i * 22, 0, i === 2 ? 25 : 12], [0, 0, 7]));
    S.box(-62, -31, 124, 65, 0, 5, 7);
    S.rim(-57, -25, 114, 53, 5.2, 5);
    S.box(-54, -19, 108, 4, 6, 3, 2);
    S.line([[-52, 21, 5.5], [52, 21, 5.5]], -1, 'lo');
    const pages = [];
    for (let i = 0; i < 5; i++) {
      const x = -53 + i * 22, y = -12 + Math.abs(i - 2), z = i === 2 ? 20 : 7 + i % 2 * 3, g = groups[i];
      S.box(x + 1, y + 2, 18, 30, z - 3, 2, 3, g);
      const page = S.box(x, y, 18, 30, z, 3, 3, g); pages.push(page);
      S.rim(x + 4, y + 4, 10, 15, z + 3.2, 2, g);
      for (let k = 0; k <= i; k++) S.dot(x + 5 + k % 3 * 3.5, y + 23 + Math.floor(k / 3) * 3, z + 3.3, .65, g);
    }
    S.focus(pages[2]); [0, 1, 3, 4].forEach(i => S.focus(pages[i]));
  };

  R.alert = function (S) {
    const message = S.group([13, 3, 17], [0, 0, 1]);
    const signal = S.group([-33, -1, 31], [0, 0, 9]);
    const latch = S.group([44, 15, 21], [0, 1, 4]);
    S.box(-59, -32, 119, 64, 0, 5, 7);
    S.rim(-53, -26, 107, 52, 5.2, 5);
    const banner = S.box(-51, -19, 104, 39, 9, 6, 6, message);
    S.rim(-14, -11, 53, 23, 15.2, 4, message);
    S.line([[-5, -4, 15.4], [29, -4, 15.4]], message);
    S.line([[-5, 5, 15.4], [19, 5, 15.4]], message);
    S.box(-46, -12, 24, 24, 15, 4, 10, signal);
    const beacon = S.box(-41, -7, 14, 14, 20, 7, 7, signal);
    S.rim(-37, -3, 6, 6, 27.2, 3, signal);
    const lock = S.box(41, 11, 7, 7, 16, 4, 3, latch);
    S.dot(44.5, 14.5, 20.2, .8, latch);
    S.focus(beacon); S.focus(banner); S.focus(lock);
  };

  R['button-group'] = function (S) {
    const groups = [0, 1, 2].map(i => S.group([-34 + i * 34, 1, i === 1 ? 24 : 14], [0, 0, i === 1 ? 5 : 9]));
    S.box(-61, -30, 122, 65, 0, 5, 7);
    S.rim(-55, -24, 110, 53, 5.2, 5);
    S.box(-53, -20, 106, 5, 6, 4, 2);
    const keys = [];
    for (let i = 0; i < 3; i++) {
      const x = -50 + i * 34, z = i === 1 ? 17 : 8 + i, g = groups[i];
      S.box(x + 3, -8, 25, 26, 6, 3, 3, g);
      const key = S.box(x, -11, 31, 34, z, 6, 5, g); keys.push(key);
      S.rim(x + 5, -5, 21, 22, z + 6.2, 3, g);
      S.line([[x + 9, 4, z + 6.3], [x + 22, 4, z + 6.3]], g);
      S.line([[x + 9, 9, z + 6.3], [x + 22, 9, z + 6.3]], g);
    }
    S.focus(keys[1]); S.focus(keys[0]); S.focus(keys[2]);
  };

  R['date-picker'] = function (S) {
    const weeks = [0, 1, 2, 3].map(i => S.group([0, -6 + i * 13, 15], [0, 0, 4 + i]));
    S.box(-53, -41, 106, 85, 0, 4, 7);
    S.box(-49, -37, 98, 76, 4, 4, 5);
    S.rim(-44, -32, 88, 66, 8.2, 3);
    S.box(-49, -37, 98, 20, 8, 3, 4);
    [-32, -11, 11, 32].forEach(x => {
      S.box(x - 3, -31, 6, 10, 11, 1.5, 2);
      const loop = Array.from({length:17}, (_, n) => {const t = n * Math.PI / 16; return [x, -26 + 7 * Math.cos(t), 12.5 + 8 * Math.sin(t)];});
      S.line(loop, -1, 'lo');
    });
    const days = [], selected = 10;
    for (let row = 0; row < 4; row++) for (let col = 0; col < 7; col++) days.push({row, col, i:row * 7 + col, x:-45 + col * 13, y:-11 + row * 13});
    days.sort((a, b) => (a.x + a.y) - (b.x + b.y));
    const focus = [];
    days.forEach(({row, col, i, x, y}) => {
      const g = weeks[row], z = i === selected ? 18 : 9 + (row + col) % 3;
      const day = S.box(x, y, 11, 10, z, 3, 2, g);
      if (i === selected) S.rim(x + 2.5, y + 2.5, 6, 5, z + 3.2, 1.5, g);
      else S.dot(x + 5.5, y + 5, z + 3.2, .7, g);
      if (col === 3) focus[row] = day;
    });
    S.focus(focus[1]); [0, 2, 3].forEach(i => S.focus(focus[i]));
  };

  R.accordion = function (S) {
    const folds = [[-45, -26, 8], [-41, -21, 21], [-46, -25, 35]];
    const groups = folds.map(([x, y, z]) => S.group([x + 44, y + 27, z + 3], [3, 0, 6]));
    S.box(-56, -37, 113, 80, 0, 4, 7);
    S.rim(-50, -31, 101, 68, 4.2, 5);
    const leaves = [];
    folds.forEach(([x, y, z], i) => {
      const g = groups[i], low = i ? folds[i - 1][2] + 3 : 4;
      [-14, 17].forEach(yh => {
        S.line([[x + 2, yh, low], [x - 4, yh, (low + z) / 2], [x + 2, yh, z + 1]], g, 'lo');
        S.box(x - 6, yh - 2.5, 6, 5, (low + z) / 2 - 1.5, 3, 2, g);
      });
      const leaf = S.box(x, y, 88, 54, z, 3, 5, g); leaves.push(leaf);
      S.rim(x + 6, y + 6, 76, 42, z + 3.2, 3, g);
      S.line([[x + 9, y + 19, z + 3.3], [x + 79, y + 19, z + 3.3]], g);
      punches(S, x + 13, y + 12, z + 3.4, i + 1, g);
      S.rim(x + 12, y + 27, 53, 13, z + 3.3, 2, g);
    });
    S.focus(leaves[2]); S.focus(leaves[0]); S.focus(leaves[1]);
  };
})();
