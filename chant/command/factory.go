package command

func Init(name string) (cmd Cmd, e error) {
    switch name {
    case "run":
        cmd = Run{"run"}
        return
    case "stop":
        cmd = Stop{"stop"}
        return
    }
    return
}
