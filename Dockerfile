FROM golang:1.5

MAINTAINER otiai10 <otiai10@gmail.com>

ADD . /go/src/chant
WORKDIR /go/src/chant
RUN go get -u github.com/revel/cmd/revel
RUN go get ./...

ENTRYPOINT revel run chant ${CHANT_ENV}

EXPOSE 14000:14000
