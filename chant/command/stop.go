package command

import "fmt"

type Stop struct {
    name string
}
func (s Stop)Execute() {
	fmt.Println(s.Name() + "!!")
}
func (s Stop)Name() string {
    return s.name
}
