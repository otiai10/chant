package main

import "chant/chant/command"
import "fmt"
import "os"

func main() {
	if len(os.Args) < 2 {
		urgeHelp()
		return
	}
	cmd, e := command.Init(os.Args[1])
	if e != nil {
		urgeHelp()
		return
	}
	cmd.Execute()
}

func urgeHelp() {
	fmt.Println("Sub command not found. Run `chant help` first.")
}
