package command

type Cmd interface {
    Name() string
    Execute()
}
