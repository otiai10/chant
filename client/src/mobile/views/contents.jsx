/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({
    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        <h1 className="modest">{this.props.name} v1</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <img src={this.props.myself.profile_image_url} className="user-icon myself" />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6">
                        <TextInput />
                    </div>
                    <div className="col s12 m6">
                        {/*
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>女医と結婚したい</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>女医と結婚したい</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>女医と結婚したい</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        */}
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <Messages />
                    </div>
                    <div className="col s12 m4">
                        {/*
                        <div className="card">
                            <div className="card-image">
                                <div className="video-container">
                                    <iframe
                                        width="853"
                                        height="480"
                                        src="//www.youtube.com/embed/Q8TXgCzxEnw?rel=0"
                                        allowfullscreen>
                                    </iframe>
                                </div>
                            </div>
                            <div className="card-content">
                                <p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. ...aaaaaaaaaaaaaaaaaaaaaaa</p>
                            </div>
                            <div className="card-action">
                                <a href="#"><i className="mdi-av-skip-previous"></i></a>
                                <a href="#"><i className="mdi-av-skip-next"></i></a>
                            </div>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        );
    }
});
