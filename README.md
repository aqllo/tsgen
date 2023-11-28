# @aqllo/tsgen

Command line tool to generate TypeScript interfaces and type aliases from a YAML specification file.

## Installation

Install via pnpm:

```sh
pnpm add -D @aqllo/tsgen
```

Install via npm:

```sh
npm i -D @aqllo/tsgen
```

## Usage

### YAML Spec example

```yaml
version: 1.0.0
interfaces:
  - person:
      id:
        type: number
      name:
        type: string
      enabled:
        type: boolean
  - category:
      id:
        type: number
      name:
        type: string
      description:
        type: string
      enabled:
        type: boolean
  - status:
      id:
        type: number
      name:
        type:
          - PENDING
          - APPROVED
          - CANCELLED
aliases:
  - create-person-request:
      interface:
        name: person
        omit:
          - id
          - enabled
  - create-category-request:
      interface:
        name: category
        pick:
          - name
          - description
  - status-request:
      type:
        - PENDING
        - APPROVED
        - CANCELLED
```

### Output

```typescript
export interface Person {
	id: number;
	name: string;
	enabled: boolean;
}

export interface Status {
	id: number;
	name: 'PENDING' | 'APPROVED' | 'CANCELLED';
}

export type CreateCategoryRequest = Pick<Category, 'name' | 'description'>;

export interface Category {
	id: number;
	name: string;
	description: string;
	enabled: boolean;
}

export type CreatePersonRequest = Omit<Person, 'id' | 'enabled'>;

export type StatusRequest = 'PENDING' | 'APPROVED' | 'CANCELLED';
```

### Command

```sh
tsgen generate -f <my-file>
```

Where:

> my-file: .yaml file, could be a local file or remote

Options:

> c: User Credentials (for GitHub access) - **Username:password**

> o: Output directory - **src** by default

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).