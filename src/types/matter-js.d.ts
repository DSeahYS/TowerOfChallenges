declare module 'matter-js' {
  export = Matter;
  export as namespace Matter;

  namespace Matter {
    interface Vector {
      x: number;
      y: number;
    }

    interface Bounds {
      min: Vector;
      max: Vector;
    }

    interface Body {
      id: number;
      type: string;
      label: string;
      parts: Body[];
      parent: Body;
      angle: number;
      vertices: Vector[];
      position: Vector;
      force: Vector;
      torque: number;
      positionImpulse: Vector;
      constraintImpulse: Vector;
      totalContacts: number;
      speed: number;
      angularSpeed: number;
      velocity: Vector;
      angularVelocity: number;
      isStatic: boolean;
      isSleeping: boolean;
      motion: number;
      sleepThreshold: number;
      density: number;
      mass: number;
      inverseMass: number;
      inertia: number;
      inverseInertia: number;
      restitution: number;
      friction: number;
      frictionStatic: number;
      frictionAir: number;
      collisionFilter: {
        category: number;
        mask: number;
        group: number;
      };
      slop: number;
      timeScale: number;
      render: {
        visible: boolean;
        opacity: number;
        sprite: any;
        lineWidth: number;
        fillStyle: string;
        strokeStyle: string;
      };
      events: any;
      bounds: Bounds;
      chamfer: any;
      circleRadius: number;
      positionPrev: Vector;
      anglePrev: number;
      parentId: number;
      axes: Vector[];
      area: number;
      massData: any;
    }

    interface Constraint {
      id: number;
      type: string;
      label: string;
      bodyA: Body;
      bodyB: Body;
      pointA: Vector;
      pointB: Vector;
      length: number;
      stiffness: number;
      damping: number;
      angularStiffness: number;
      angleA: number;
      angleB: number;
      render: any;
    }

    interface Engine {
      world: World;
      timing: {
        timestamp: number;
        timeScale: number;
        lastDelta: number;
        lastElapsed: number;
        delta: number;
        correction: number;
        deltaMin: number;
        deltaMax: number;
        fps: number;
        frameCounter: number;
        deltaHistory: number[];
        timePrev: number | null;
        timeScalePrev: number;
        frameRequestId: number | null;
      };
      broadphase: any;
      narrowphase: any;
      constraintIterations: number;
      positionIterations: number;
      velocityIterations: number;
      enableSleeping: boolean;
      events: any;
      plugin: any;
      render: any;
      runner: any;
    }

    interface World extends Body {
      gravity: Vector;
      bounds: Bounds;
    }

    interface Mouse {
      element: HTMLElement;
      absolute: Vector;
      position: Vector;
      mousedownPosition: Vector;
      mouseupPosition: Vector;
      offset: Vector;
      scale: Vector;
      wheelDelta: number;
      button: number;
      pixelRatio: number;
    }

    interface MouseConstraint {
      type: string;
      mouse: Mouse;
      element: HTMLElement;
      body: Body;
      constraint: Constraint;
      collisionFilter: any;
    }

    class Bodies {
      static rectangle(x: number, y: number, width: number, height: number, options?: any): Body;
      static circle(x: number, y: number, radius: number, options?: any): Body;
      static polygon(x: number, y: number, sides: number, radius: number, options?: any): Body;
      static trapezoid(x: number, y: number, width: number, height: number, slope: number, options?: any): Body;
      static fromVertices(x: number, y: number, vertices: Vector[][], options?: any): Body;
    }

    class Body {
      static create(options?: any): Body;
      static setStatic(body: Body, isStatic: boolean): void;
      static setPosition(body: Body, position: Vector): void;
      static setVelocity(body: Body, velocity: Vector): void;
      static setAngle(body: Body, angle: number): void;
      static applyForce(body: Body, position: Vector, force: Vector): void;
      static update(body: Body, delta: number, timeScale: number, correction: number): void;
      static getSpeed(body: Body): number;
      static getAngularSpeed(body: Body): number;
      static getVelocity(body: Body): Vector;
      static getAngularVelocity(body: Body): number;
      static setMass(body: Body, mass: number): void;
      static setDensity(body: Body, density: number): void;
      static setInertia(body: Body, inertia: number): void;
      static translate(body: Body, translation: Vector): void;
      static rotate(body: Body, rotation: number): void;
      static scale(body: Body, scaleX: number, scaleY: number): void;
    }

    class Composite {
      static add(composite: any, object: any): any;
      static remove(composite: any, object: any, deep?: boolean): any;
      static addComposite(composite: any, child: any): any;
      static removeComposite(composite: any, child: any, deep?: boolean): any;
      static getComposite(composite: any, id: number): any;
      static move(composite: any, objects: any[], source: any, destination: any): any;
      static rebase(composite: any): any;
      static translate(composite: any, translation: Vector, recursive?: boolean): any;
      static rotate(composite: any, rotation: number, point: Vector, recursive?: boolean): any;
      static scale(composite: any, scaleX: number, scaleY: number, point: Vector, recursive?: boolean): any;
      static bounds(composite: any, bodies?: Body[], padding?: number): Bounds;
    }

    class Composites {
      static stack(xx: number, yy: number, columns: number, rows: number, columnGap: number, rowGap: number, callback: Function): any;
      static chain(composite: any, xOffsetA: number, yOffsetA: number, xOffsetB: number, yOffsetB: number, options?: any): any;
      static mesh(composite: any, columns: number, rows: number, crossBrace: boolean, options?: any): any;
      static pyramid(xx: number, yy: number, columns: number, rows: number, columnGap: number, rowGap: number, callback: Function): any;
      static newtonsCradle(xx: number, yy: number, number: number, size: number, length: number): any;
      static car(xx: number, yy: number, width: number, height: number, wheelSize: number): any;
      static softBody(xx: number, yy: number, columns: number, rows: number, columnGap: number, rowGap: number, crossBrace: boolean, particleRadius: number, particleOptions?: any, constraintOptions?: any): any;
    }

    class Constraint {
      static create(options: any): Constraint;
      static update(constraint: Constraint, bodyA: Body, bodyB: Body, delta: number): void;
    }

    class Engine {
      static create(options?: any): Engine;
      static update(engine: Engine, delta?: number, correction?: number): void;
      static merge(engine: Engine, other: Engine): void;
      static clear(engine: Engine): void;
      static run(engine: Engine): any;
    }

    class Events {
      static on(obj: any, name: string, callback: Function): void;
      static off(obj: any, name: string, callback: Function): void;
      static trigger(obj: any, name: string, event?: any): void;
    }

    class Mouse {
      static create(element: HTMLElement): Mouse;
      static setElement(mouse: Mouse, element: HTMLElement): void;
      static clearSourceEvents(mouse: Mouse): void;
      static setOffset(mouse: Mouse, offset: Vector): void;
      static setScale(mouse: Mouse, scale: Vector): void;
    }

    class MouseConstraint {
      static create(engine: Engine, options?: any): MouseConstraint;
      static update(mouseConstraint: MouseConstraint, bodies: Body[]): void;
    }

    class Render {
      static create(options: any): any;
      static run(render: any): void;
      static stop(render: any): void;
      static lookAt(render: any, objects: any, padding?: any, center?: boolean): void;
      static startViewTransform(render: any): void;
      static endViewTransform(render: any): void;
      static translate(render: any, translate: Vector): void;
      static zoom(render: any, zoom: number): void;
      static update(render: any): void;
      static world(render: any, bodies?: Body[]): void;
    }

    class Runner {
      static create(options?: any): any;
      static run(runner: any, engine: Engine): any;
      static stop(runner: any): void;
      static tick(runner: any, engine: Engine, time: number): void;
      static start(runner: any, engine: Engine): void;
    }

    class Sleeping {
      static set(body: Body, isSleeping: boolean): void;
    }

    class Vector {
      static create(x?: number, y?: number): Vector;
      static clone(vector: Vector): Vector;
      static magnitude(vector: Vector): number;
      static magnitudeSquared(vector: Vector): number;
      static rotate(vector: Vector, angle: number): Vector;
      static rotateAbout(vector: Vector, angle: number, point: Vector): Vector;
      static normalise(vector: Vector): Vector;
      static dot(vectorA: Vector, vectorB: Vector): number;
      static cross(vectorA: Vector, vectorB: Vector): number;
      static cross3(vectorA: Vector, vectorB: Vector, vectorC: Vector): number;
      static add(vectorA: Vector, vectorB: Vector): Vector;
      static sub(vectorA: Vector, vectorB: Vector): Vector;
      static mult(vector: Vector, scalar: number): Vector;
      static div(vector: Vector, scalar: number): Vector;
      static perp(vector: Vector, negate?: boolean): Vector;
      static neg(vector: Vector): Vector;
      static angle(vectorA: Vector, vectorB: Vector): number;
    }

    class Vertices {
      static create(points: Vector[], body?: Body): Vector[];
      static fromPath(path: string, body?: Body): Vector[];
      static centre(vertices: Vector[]): Vector;
      static mean(vertices: Vector[]): Vector;
      static area(vertices: Vector[], signed?: boolean): number;
      static inertia(vertices: Vector[], mass: number): number;
      static translate(vertices: Vector[], vector: Vector, scalar?: number): Vector[];
      static rotate(vertices: Vector[], angle: number, point: Vector): Vector[];
      static contains(vertices: Vector[], point: Vector): boolean;
      static scale(vertices: Vector[], scaleX: number, scaleY: number, point: Vector): Vector[];
      static chamfer(vertices: Vector[], radius: number[], quality: number, qualityMin: number, qualityMax: number): Vector[];
      static hull(vertices: Vector[]): Vector[];
      static clockwiseSort(vertices: Vector[]): Vector[];
    }

    class World {
      static create(options?: any): World;
      static add(world: World, body: Body | Constraint | any): void;
      static remove(world: World, body: Body | Constraint | any, deep?: boolean): void;
      static addComposite(world: World, composite: any): void;
      static addBody(world: World, body: Body): void;
      static addConstraint(world: World, constraint: Constraint): void;
      static clear(world: World, keepStatic?: boolean): void;
    }

    class Common {
      static extend(obj: any, deep?: boolean, ...sources: any[]): any;
      static clone(obj: any, deep?: boolean): any;
      static keys(obj: any): string[];
      static values(obj: any): any[];
      static get(obj: any, path: string, begin?: number, end?: number): any;
      static set(obj: any, path: string, val: any, begin?: number, end?: number): any;
      static shuffle(array: any[]): any[];
      static choose(choices: any[]): any;
      static isElement(obj: any): boolean;
      static isArray(obj: any): boolean;
      static isFunction(obj: any): boolean;
      static isPlainObject(obj: any): boolean;
      static isString(obj: any): boolean;
      static isNumber(obj: any): boolean;
      static isUndefined(obj: any): boolean;
      static isDefined(obj: any): boolean;
      static isBoolean(obj: any): boolean;
      static isEmpty(obj: any): boolean;
      static each(obj: any, callback: Function): void;
      static map(obj: any, callback: Function): any[];
      static chain(obj: any, callback: Function): any;
      static chainPath(obj: any, path: string): any;
      static forEach(obj: any, callback: Function): void;
      static range(start: number, end: number, step?: number): number[];
      static nextId(): number;
      static indexOf(haystack: any[], needle: any): number;
      static unique(arr: any[]): any[];
      static sign(n: number): number;
      static clamp(value: number, min: number, max: number): number;
      static random(min?: number, max?: number): number;
      static randomInt(min: number, max: number): number;
      static now(): number;
      static log(...args: any[]): void;
      static info(...args: any[]): void;
      static warn(...args: any[]): void;
      static error(...args: any[]): void;
      static deprecated(obj: any, prop: string, warning: string): void;
      static warnOnce(obj: any, warning: string): void;
      static deprecatedMethod(obj: any, method: string, warning: string): void;
      static logLevel: number;
      static uses: any[];
      static version: string;
    }

    class Plugin {
      static register(plugin: any): void;
      static resolve(id: string): any;
      static toString(plugin: any): string;
      static isPlugin(obj: any): boolean;
      static dependencies(plugin: any, all?: boolean): any[];
      static name(plugin: any): string;
      static version(plugin: any): string;
    }

    class Axes {
      static fromVertices(vertices: Vector[]): Vector[];
      static rotate(axes: Vector[], angle: number): Vector[];
    }

    class Bounds {
      static create(vertices: Vector[]): Bounds;
      static update(bounds: Bounds, vertices: Vector[], velocity: Vector): void;
      static contains(bounds: Bounds, point: Vector): boolean;
      static overlaps(boundsA: Bounds, boundsB: Bounds): boolean;
      static translate(bounds: Bounds, vector: Vector): void;
      static shift(bounds: Bounds, vector: Vector): void;
    }

    class Svg {
      static pathToVertices(path: any, sampleLength?: number): Vector[];
    }

    class Collision {
      static create(bodyA: Body, bodyB: Body): any;
      static collides(bodyA: Body, bodyB: Body, pairs?: any): any;
      static ray(body: Body, startPoint: Vector, endPoint: Vector): any;
      static point(body: Body, point: Vector): boolean;
    }

    class Detector {
      static canCollide(filterA: any, filterB: any): boolean;
      static find(pairs: any, bodies: Body[]): any[];
      static clear(detector: any): void;
      static reset(detector: any, bodies: Body[]): void;
      static update(detector: any, bodies: Body[], engine: Engine): void;
    }

    class Grid {
      static create(options?: any): any;
      static update(grid: any, bodies: Body[], engine: Engine, forceUpdate: boolean): void;
      static clear(grid: any): void;
    }

    class Pairs {
      static create(options?: any): any;
      static update(pairs: any, collisions: any[], timestamp: number): void;
      static removeOld(pairs: any, timestamp: number): void;
      static clear(pairs: any): void;
    }

    class Query {
      static ray(bodies: Body[], startPoint: Vector, endPoint: Vector, rayWidth?: number): any[];
      static point(bodies: Body[], point: Vector): Body[];
      static region(bodies: Body[], region: Bounds, outside?: boolean): Body[];
    }

    class Resolver {
      static preSolvePosition(pairs: any): void;
      static solvePosition(pairs: any, timeScale: number): void;
      static postSolvePosition(bodies: Body[]): void;
      static preSolveVelocity(pairs: any): void;
      static solveVelocity(pairs: any, timeScale: number): void;
    }

    class SAT {
      static collides(bodyA: Body, bodyB: Body): any;
    }
  }
}