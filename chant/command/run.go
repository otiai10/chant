package command

import "fmt"

type Run struct {
    name string
}
func (r Run)Execute() {
	fmt.Println(r.Name() + "!!")
}
func (r Run)Name() string {
    return r.name
}
