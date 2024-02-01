abstract class ChangeTracker {
    abstract readonly changes: Map<string, any>;
}

function trackChanges(key: string) {
    return function (target: any, propertyKey:string) {
        let value = target[propertyKey]
        const getter = function () {
            return value;
        };
        const setter = function (this: { changes: Map<string, any>; } & IEntity & ChangeTracker, newValue: any) {
            this.changes.set(key, newValue);
            value = newValue;
        };

        Reflect.defineProperty(target, propertyKey, {
            set: setter,
            get: getter,
            enumerable: true,
            configurable: true,
        });
    };
}

abstract class StringValueObject<
    TMinLength extends number = 0,
    TMaxLength extends number = 50
> extends String {
    constructor(
        public readonly value: string,
        protected readonly min: TMinLength,
        protected readonly max: TMaxLength
    ) {
        if (value.length > max || value.length < min) {
            throw new Error("Argument length error");
        }
        super(value);
    }
}


class Baz extends StringValueObject<3, 9> {
    constructor(value: string) {
        super(value, 3, 9)
    }
}

interface IDomainEvent { }

interface IEntity {
    readonly events: IDomainEvent[];
}

interface IFoo {
    readonly baz: StringValueObject<3, 9>;
    changeBaz(baz: StringValueObject<3, 9>): void;
}


abstract class Entity {
    constructor(
        public readonly changes: Map<string, any>,
        public readonly events: IDomainEvent[],
    ) {
    }
}

class Foo extends Entity implements ChangeTracker, IEntity, IFoo {
    @trackChanges("abc")
    public baz: StringValueObject<3, 9>

    private constructor(
        baz: StringValueObject<3, 9>
    ) {
        super(new Map(), []);
        this.baz = baz
    }

    static create(baz: StringValueObject<3, 9>): ChangeTracker & IEntity & IFoo {
        return new Foo(baz);
    }

    changeBaz(baz: StringValueObject<3, 9>) {
        this.baz = baz;
    }
}


const foo = Foo.create(new Baz('BAZ_VALUE'))
console.log(foo.changes)
foo.changeBaz(new Baz('UPDATED'))
console.log(foo.changes)
