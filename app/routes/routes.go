// GENERATED CODE - DO NOT EDIT
package routes

import "github.com/revel/revel"


type tApplication struct {}
var Application tApplication


func (_ tApplication) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Application.Index", args).Url
}

func (_ tApplication) Login(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Application.Login", args).Url
}


type tAuth struct {}
var Auth tAuth


func (_ tAuth) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Auth.Index", args).Url
}

func (_ tAuth) Callback(
		oauth_verifier string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "oauth_verifier", oauth_verifier)
	return revel.MainRouter.Reverse("Auth.Callback", args).Url
}


type tPreview struct {}
var Preview tPreview


func (_ tPreview) Index(
		url string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "url", url)
	return revel.MainRouter.Reverse("Preview.Index", args).Url
}


type tRoom struct {}
var Room tRoom


func (_ tRoom) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Room.Index", args).Url
}

func (_ tRoom) Leave(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("Room.Leave", args).Url
}


type tChantSocket struct {}
var ChantSocket tChantSocket


func (_ tChantSocket) RoomSocket(
		ws interface{},
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "ws", ws)
	return revel.MainRouter.Reverse("ChantSocket.RoomSocket", args).Url
}


type tStatic struct {}
var Static tStatic


func (_ tStatic) Serve(
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.Serve", args).Url
}

func (_ tStatic) ServeModule(
		moduleName string,
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "moduleName", moduleName)
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.ServeModule", args).Url
}


