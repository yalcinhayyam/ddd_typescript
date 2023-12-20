interface IOption {
    id: string
    key: string
    price: number,
}
interface IProduct {
    readonly id: string,
    readonly title: string,
    readonly options: readonly IOption[]
}




class Product implements IProduct {
    constructor(
        private readonly _id: string,
        private _title: string,
        private _options: IOption[]
    ) { }


    get title(): string {
        return this._title
    }
    get options(): readonly IOption[] {
        return this._options
    }
    get id(): string {
        return this._id
    }
    /*
        static destruct(product: IProduct): Product {
            return new Product()
        }
    */
    static create(title: string): Product {
        return new Product("", title, [] as const)
    }

    addOption(key: string, price: number): void {
        this._options.push({ id: "", key, price })
    }
}

const product = Product.create("Abc")


const product2: IProduct = {
    id: "12",
    title: "test title",
    options: []
}

console.log(product2, product2.id)

class Publisher {
    static notifications: {
        notification: {prototype: NotificationType, name: string},
        handlers: {prototype: AbstractNotificationHandler<any>, name:string}[]
        
    }[] = []
    static publish(notification: INotification) {      

        const notation = this.notifications.find(n => n.notification.name === ProductCreatedEvent.name)
        if (!notation) {
            throw new Error('notation not found')
        }
        notation.handlers.forEach(handler => handler.prototype.handle(notification))
    }
}
interface INotification {
   // publishedAt: Date
}

abstract class AbstractNotificationHandler<T extends INotification> {
    abstract handle(notification: T): void
}

type NotificationType = new (...args: any[]) => INotification 
type NotificationHandlerType<T extends INotification> = new (...args: any[]) => AbstractNotificationHandler<T>


class ProductCreatedEvent implements INotification {
    constructor(public message: string){}
}


@NotificationHandler(ProductCreatedEvent as any)
class ProductCreatedEventHandler extends AbstractNotificationHandler<ProductCreatedEvent>{
    handle(notification: ProductCreatedEvent): void {
       console.log(notification.message)
    }
}


function NotificationHandler<T extends NotificationType>(notification: T) {
    return function (target: NotificationHandlerType<T>) {
        const notation = Publisher.notifications.find(n => n.notification.name === notification.name)
        if (!notation) {
            Publisher.notifications.push({ notification: notification, handlers: [target] })
            return
        }
        notation.handlers.push(target)

    }
}



Publisher.publish(new ProductCreatedEvent('hello'))
