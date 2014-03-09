//Typescript declarations for swfobject
interface Iswfobject {
    embedSWF(swfUrl: string,
        id: string,
        width: string,
        height: string,
        version: string,
        expressInstallSwfurl?: string,
        flashvars?: IFlashVars,
        params?: any,
        attributes?: any,
        callback?: any);
}

interface IFlashVars {

}

declare var swfobject: Iswfobject;
