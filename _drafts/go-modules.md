# Dependency Management With Go Modules
I have been writing applications in Golang for a little over six months now. In this post I want to share my experience working with dependencies, project setup, and my latest move to using go modules.

## Baby Gopher
In many ways I am still a baby Gopher, in my early stages of Golang development. But allow me to take you on a short journey through my earliest Golang development projects.

My first few applications were simple APIs that used the traditional setup model for Go projects whereby all Golang code must live inside of `$GOPATH`, which is officially recommended in [How to Write Go Code](https://golang.org/doc/code.html). In this dependency management model, `$GOPATH` is the root of the Golang development environment, allowing for Go to easily locate all dependencies and compiled executables through the paths that it recognizes, mainly `$GOPATH/bin`, `$GOPATH/pkg`, `$GOPATH/src`. 

As I was learning my way through new syntax and what a package means in Golang, I started running into occasional issues building and deploying my applications which were pulling in the latest dependency changes and causing failures. I needed a way to lock my dependencies to versions that I knew worked without issue. So I searched the interwebs and found a couple of answers. My first stop was using the dep tool.

### Using dep inside $GOPATH
In my first projects, I introduced the [dep](https://github.com/golang/dep) tool to manage dependencies, which creates a `/vendor` directory with the entirety of all dependency libraries committed to source control and `Gopkg.toml` and `Gopkg.lock` files to manage versions, etc.  It took some getting used to to commit all dependencies to source control. Coming from many years of JavaScript development, the idea of submitting the equivalent of the  `/node_modules` folder to source control is a noob mistake that should be corrected by promptly adding it to `.gitignore`. But committing the `/vendor` folder to source control has its benefits. For one, you don't have to worry about your dependencies being removed or being inaccessible because they are checked in with your code. We often leave the fate of our production applications in the hands of third party libraries we depend on, so committing dependencies isn't such a terrible idea.

But dependency management aside, working inside of `$GOPATH` has its own constraints. What a lot of developers will recognize when setting up their first projects is that the traditional setup inside of `$GOPATH` is a highly proscriptive directory structure and requires a bit of overhead before starting to write go code.

I found myself asking, and fielding from others, the questions,
> Do I have to make all of my projects inside of `$GOPATH/src`? Will everything break if I move outside of `$GOPATH`?

Before Go modules the answer would have been a resounding `Yes`, which immediately deters developers coming from most other programming languages that allow for more flexibility in develop and build environments. But go modules removes this project overhead by allowing you to create applications outside of `$GOPATH` anywhere on your file system. Hooray! But not without a little set up of its own...

## Go Modules: Life Outside $GOPATH
First of all, in the Golang ecosphere a module is a collection of packages. There are [official docs]() for working with Go modules which detail the basic setup that gets you a hello world with imported libraries. I won't belabor what is fairly succintly documented there, but I found there were some necessary steps for getting beyond `Hello World` that were not clearly detailed in the docs. Hopefully this saves someone else time scouring the internet for answers.

### Setting GO111MODULE=on ; Go version < version
This is particular to Go version, but before Go version --insert go version here-- you have to set an environment variable in your shell when executing `go build` and other go cli commands in order for go to know you are using modules and not the traditional setup.

Go version --insert go version-- and beyond will recognize this automatically when it sees a go.mod file in the root of your project. (<<<<--- verify this)

### Initializing go modules: go mod init
As the docs state, 

### Trick: Recognizing local files within your module
I call this a trick because I had to dig through the internet for some time before I figured this out.

In order for go modules to recognize local files your module needs to be initialized with a name during the `go mod init` step. Why this is not part of the basic setup documentation, I. don't. know. -- insert neutral emoji face here --

Typically, go projects, even when outside of `$GOPATH` follow a convention of using directory structures to indicate where the module lives in source control. So if I were setting up a new project called `stardust` that would live in my github repository, my directory structure would look like:
```
github.com/sharkySharks/stardust/

{source-control-root}/{user-name}/{project-name}
```
I would then initialize my module in the root of the project with this name as the module name:
```
go mod init github.com/sharkySharks/stardust
```

This would then create a `go.mod` file that looks like this:
```
module github.com/sharkySharks/stardust/

go 1.13
```

And in `main.go` I could import local and global packages like so,
```
package main

import (
"context"
"log"
"os"
"time"
"google.golang.org/grpc"
"github.com/sharkySharks/stardust/other-files"
)
```

### Running go build and go test will generate go.sum
Once you run `go build` or `go test` in your project then a `require()` section will be added to the `go.mod` file with all of the dependencies of your module. A `go.sum` file will also be generated that includes all the cryptographic hashes (<<-- confirm name) of all of the dependencies. You can also manually alter the `go.mod` file with a different version of the package that you need.

You want to commit `go.mod` and `go.sum` to source control, as this will be the source of truth for dependencies in your project.