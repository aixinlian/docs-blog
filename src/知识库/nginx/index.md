# nginx

https://nginx.org/en/download.html

## 配置文件

```nginx
# 全局段配置
# ------------------------------
# 指定运行nginx的用户或用户组，默认为nobody
# window下不生效且会报错
#user nobody;


# 设置工作进程数，通常设置为等于CPU核心数
worker_processes  1;


# 指定错误日志的存放路径和日志级别 debug|info|notice|warn|error
error_log logs/error.log debug;


# 指定nginx进程的PID文件存放位置，在 Nginx 启动时，它会将主进程的 PID 写入到这个文件中
#pid nginx/pid/nginx.pid;


# events段配置信息
# ------------------------------
events {
    # 默认开启 -开启之后nginx的多个worker将以串行的方式处理
    # 有一个任务，将会有一个worker被唤醒，其他worker继续睡眠
    # 不开启会造成 惊群效应 一个任务被多个worker抢夺
    accept_mutex on;    #性能优化

    # 设置工作进程的最大连接数。
    worker_connections  1024;
}


# http配置段，用于配置HTTP服务器的参数
# ------------------------------
http {
    # 包含同级目录下的MIME类型的配置文件
    # 可以使用include引入外部文件，这样可以让配置文件更整洁，易于管理
    include       mime.types;

    # 设置默认的MIME文件类型
    default_type  application/octet-stream;

    # http错误日志格式
    # log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # http错误日志存放位置和日志格式，main就是上面日志格式定义的，当用户访问服务器，都会记录日志
    # access_log  logs/access.log main

    # 调用底层操作系统的读写减少上下文的切换，提高性能
    sendfile        on;   #性能优化

    # 建立TCP连接之后，在65秒内看是否有其他请求，如果有其他请求，则会利用这个未被关闭的连接，而不需要再建立一个连接
    keepalive_timeout  65;

    # 开启GZIP压缩，可以减少网络传输量，提高访问速度，默认开启
    # gzip  on;


    # server配置段，每个http块可以有多个server块，每个server块可以配置多个虚拟主机
    # 每个server相当于一个虚拟主机
    # ------------------------------
    server {
        # 监听端口
        listen       80;
        # 定义服务器域名，在本地使用IP或localhost来访问，发布到外网，使用域名访问，这里可以配置为域名
        server_name  localhost;

        # 反向代理，解决跨域
        # location块，拦截所有带有 /api/ 的请求
        # ------------------------------
        location /api/ {
            proxy_set_header Host $http_host;   # 修改从客户端传递到代理服务器的请求头
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 代理转发，解决跨域
            proxy_pass  http://localhost:8080; # 后端服务地址
        }

        # location块，拦截所有请求
        # ------------------------------
        location / {
            # 设置请求的根目录
            root   html;
            # 设置默认页面
            index  index.html index.htm;
            # vue是单页面应用，history模式刷新404 解决办法
            try_files $uri $uri/ /index.html;
        }

        error_page   500 502 503 504  /50x.html;  # 定义了处理服务器错误的页面
        location = /50x.html {  # 定义了处理 /50x.html 页面的逻辑。
            root   html;  # 指定了50x.html页面在html目录下。
        }
    }
}
```

## 反向代理

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

所有发送到 localhost 的请求都会被代理到 localhost:8080。

### proxy_pass

root 指定目录的上级目录，并且该上级目录要含义 location 指定名称的同名目录

若按照这种配置，访问/img/目录下的文件时，nginx 会去/var/www/image/img/目录下寻找文件

```nginx
location /img/ {
  root /var/www/image
}
```

URL 路径后面加 `/` ，相当于是绝对路径，nginx 不会把 `location` 中匹配的 路径部分 加入到代理 URL 中
访问 `http://IP/test/proxy.html`，最终代理到的 URL 是 `http://127.0.0.1/proxy.html`

```nginx
location /test/ {
  proxy_pass http://localhost:8080/;
}
```

URL 路径后面不加 `/` ，nginx 会把 `location` 中匹配的 路径部分 加入到代理 URL 中
访问 `http://IP/test/proxy.html`，最终代理到的 URL 是 `http://127.0.0.1/test/proxy.html`

```nginx
location /test/ {
  proxy_pass http://localhost:8080;
}
```

## 负载均衡

默认是轮询的方式去分发请求

### weight 权重

weight 更改权重，权重越大，分配的请求越多

```nginx
http{
  upstream node {
    server 127.0.0.1:9001 weight=1;
    server 127.0.0.1:9002 weight=1;
    server 127.0.0.1:9003 weight=1;
  }
  server{
    listen 80;
    server_name localhost;
    location / {
      proxy_pass http://node;
    }
  }
}
```

### fail_timeout 超时时间

backup 是备用服务器，如果其他服务器设置的超时时间都超时了，就会使用备用服务器

```nginx
http{
  upstream node {
    server 127.0.0.1:9001 fail_timeout=60;
    server 127.0.0.1:9002 fail_timeout=20;
    server 127.0.0.1:9003 backup;
  }
  server{
    listen 80;
    server_name localhost;
    location / {
      proxy_pass http://node;
    }
  }
}
```
