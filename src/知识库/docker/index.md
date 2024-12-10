# docker

官网 https://www.docker.com/

## docker 镜像加速

```bash
"registry-mirrors": [
  "https://docker.linkedbus.com",
  "https://docker.xuanyuan.me"
]
```

```bash
"registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live"
]
```

可参考地址 https://github.com/tech-shrimp/docker_installer

## docker 命令

### 查看帮助

```bash
--help
```

### 镜像操作

#### 下载镜像

```bash
docker pull 镜像名[:版本号]
```

#### 查看所有镜像

```bash
docker images
```

```bash
docker image ls
```

#### 移除镜像

```bash
docker rmi [镜像名 | 镜像id] [-f 强制删除]
```

### 容器操作

#### 运行容器

```bash
docker run [options] 镜像名[:版本号]
```

options:

- `-d` 后台运行
- `--name` 自定义容器名
- `--network` 自定义网络
- `-p 88:80` 端口映射 外部端口:内部端口 （每个容器相当于一个主机，容器可以映射相同的端口号，因为容器之间互相隔离）

#### 查看所有正在运行的容器

```bash
docker ps [-a 查看所有容器 -q 显示容器id]
```

#### 启动容器

```bash
docker start [容器名 | 容器id]
```

#### 停止容器

```bash
docker stop [容器名 | 容器id]
```

#### 重启容器

```bash
docker restart [容器名 | 容器id]
```

#### 查看容器状态

```bash
docker stats [容器名 | 容器id]
```

#### 查看容器日志

```bash
docker logs [容器名 | 容器id]
```

#### 删除容器

```bash
docker rm [容器名 | 容器id] [-f 强制删除]
```

#### 删除所有容器

```bash
docker rm -f $(docker ps -a -q)
```

#### 进入容器

```bash
docker exec -it [容器名 | 容器id] /bin/bash
```

- 必须运行中的容器才能进入
- `-it` 以交互模式进入容器,要对他进行操作
- `/bin/bash` 使用 bash 命令行
- exit 退出容器

### 保存镜像（保存为文件）

#### 提交

```bash
docker commit [options] [容器名 | 容器id] [镜像名[:版本号]]
```

#### 保存

```bash
docker save [options] [镜像名[:版本号]]
```

#### 加载

```bash
docker load [options]
```

### 分享镜像

#### 登录

```bash
docker login
```

#### 命名

```bash
docker tag
```

#### 推送

```bash
docker push [镜像名[:版本号]]
```

### 目录挂载

在启动容器时，将主机的目录与容器内的目录进行映射，这样就可以在主机中操作容器内的文件了。

宿主机没有目录则会自动创建

```bash
docker run -d -p 80:80 -v /宿主机目录:/容器内目录 镜像名[:版本号]
```

### 卷映射

在启动容器时，将主机的目录与容器内的目录进行映射，这样就可以在主机中操作容器内的文件了。

```bash
docker run -d -p 80:80 -v 卷名:/容器内目录 镜像名[:版本号]
```

卷都在`/var/lib/docker/volumes`目录下

#### 创建卷

```bash
docker volume create [卷名]
```

#### 删除卷

```bash
docker volume rm [卷名]
```

#### 查看卷

```bash
docker volume ls
```

#### 查看卷详情

```bash
docker volume inspect [卷名]
```

### 自定义网络

```bash
docker network --help
```

#### 创建网络

```bash
docker network create [options] [网络名]
```

#### 删除网络

```bash
docker network rm [网络名]
```

#### 查看网络

```bash
docker network ls
```

#### 查看网络详情

```bash
docker network inspect [网络名]
```

#### 连接网络

```bash
docker network connect [options] [网络名] [容器名 | 容器id]
```

#### 断开网络

```bash
docker network disconnect [options] [网络名] [容器名 | 容器id]
```

## compose.yaml

compose 一键启动多个容器

https://docs.docker.com/reference/compose-file/

:::info
顶级元素

name 名字

services 服务

networks 网络

volumes 卷

configs 配置

secrets 密钥
:::

### 使用 compose 启动

```bash
docker compose up [-d 后台运行]
```

## Dockerfile 制作镜像

https://docs.docker.com/reference/dockerfile/

Dockerfile 是一个用来构建镜像的文本文件，包含了一条条的指令，每一条指令构建一层，通过叠加层构建出一个完整的镜像。

## compose.yaml 参考

```yaml
name: devsoft
services:
  redis:
    image: bitnami/redis:latest
    restart: always
    container_name: redis
    environment:
      - REDIS_PASSWORD=123456
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/bitnami/redis/data
      - redis-conf:/opt/bitnami/redis/mounted-etc
      - /etc/localtime:/etc/localtime:ro

  mysql:
    image: mysql:8.0.31
    restart: always
    container_name: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=123456
    ports:
      - '3306:3306'
      - '33060:33060'
    volumes:
      - mysql-conf:/etc/mysql/conf.d
      - mysql-data:/var/lib/mysql
      - /etc/localtime:/etc/localtime:ro

  rabbit:
    image: rabbitmq:3-management
    restart: always
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'
    environment:
      - RABBITMQ_DEFAULT_USER=rabbit
      - RABBITMQ_DEFAULT_PASS=rabbit
      - RABBITMQ_DEFAULT_VHOST=dev
    volumes:
      - rabbit-data:/var/lib/rabbitmq
      - rabbit-app:/etc/rabbitmq
      - /etc/localtime:/etc/localtime:ro
  opensearch-node1:
    image: opensearchproject/opensearch:2.13.0
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster # Name the cluster
      - node.name=opensearch-node1 # Name the node that will run in this container
      - discovery.seed_hosts=opensearch-node1,opensearch-node2 # Nodes to look for when discovering the cluster
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2 # Nodes eligibile to serve as cluster manager
      - bootstrap.memory_lock=true # Disable JVM heap memory swapping
      - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m' # Set min and max JVM heap sizes to at least 50% of system RAM
      - 'DISABLE_INSTALL_DEMO_CONFIG=true' # Prevents execution of bundled demo script which installs demo certificates and security configurations to OpenSearch
      - 'DISABLE_SECURITY_PLUGIN=true' # Disables Security plugin
    ulimits:
      memlock:
        soft: -1 # Set memlock to unlimited (no soft or hard limit)
        hard: -1
      nofile:
        soft: 65536 # Maximum number of open files for the opensearch user - set to at least 65536
        hard: 65536
    volumes:
      - opensearch-data1:/usr/share/opensearch/data # Creates volume called opensearch-data1 and mounts it to the container
      - /etc/localtime:/etc/localtime:ro
    ports:
      - 9200:9200 # REST API
      - 9600:9600 # Performance Analyzer

  opensearch-node2:
    image: opensearchproject/opensearch:2.13.0
    container_name: opensearch-node2
    environment:
      - cluster.name=opensearch-cluster # Name the cluster
      - node.name=opensearch-node2 # Name the node that will run in this container
      - discovery.seed_hosts=opensearch-node1,opensearch-node2 # Nodes to look for when discovering the cluster
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2 # Nodes eligibile to serve as cluster manager
      - bootstrap.memory_lock=true # Disable JVM heap memory swapping
      - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m' # Set min and max JVM heap sizes to at least 50% of system RAM
      - 'DISABLE_INSTALL_DEMO_CONFIG=true' # Prevents execution of bundled demo script which installs demo certificates and security configurations to OpenSearch
      - 'DISABLE_SECURITY_PLUGIN=true' # Disables Security plugin
    ulimits:
      memlock:
        soft: -1 # Set memlock to unlimited (no soft or hard limit)
        hard: -1
      nofile:
        soft: 65536 # Maximum number of open files for the opensearch user - set to at least 65536
        hard: 65536
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - opensearch-data2:/usr/share/opensearch/data # Creates volume called opensearch-data2 and mounts it to the container

  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:2.13.0
    container_name: opensearch-dashboards
    ports:
      - 5601:5601 # Map host port 5601 to container port 5601
    expose:
      - '5601' # Expose port 5601 for web access to OpenSearch Dashboards
    environment:
      - 'OPENSEARCH_HOSTS=["http://opensearch-node1:9200","http://opensearch-node2:9200"]'
      - 'DISABLE_SECURITY_DASHBOARDS_PLUGIN=true' # disables security dashboards plugin in OpenSearch Dashboards
    volumes:
      - /etc/localtime:/etc/localtime:ro
  zookeeper:
    image: bitnami/zookeeper:3.9
    container_name: zookeeper
    restart: always
    ports:
      - '2181:2181'
    volumes:
      - 'zookeeper_data:/bitnami'
      - /etc/localtime:/etc/localtime:ro
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes

  kafka:
    image: 'bitnami/kafka:3.4'
    container_name: kafka
    restart: always
    hostname: kafka
    ports:
      - '9092:9092'
      - '9094:9094'
    environment:
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://0.0.0.0:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,EXTERNAL://119.45.147.122:9094
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - ALLOW_PLAINTEXT_LISTENER=yes
      - 'KAFKA_HEAP_OPTS=-Xmx512m -Xms512m'
    volumes:
      - kafka-conf:/bitnami/kafka/config
      - kafka-data:/bitnami/kafka/data
      - /etc/localtime:/etc/localtime:ro
  kafka-ui:
    container_name: kafka-ui
    image: provectuslabs/kafka-ui:latest
    restart: always
    ports:
      - 8080:8080
    environment:
      DYNAMIC_CONFIG_ENABLED: true
      KAFKA_CLUSTERS_0_NAME: kafka-dev
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
    volumes:
      - kafkaui-app:/etc/kafkaui
      - /etc/localtime:/etc/localtime:ro

  nacos:
    image: nacos/nacos-server:v2.3.1
    container_name: nacos
    ports:
      - 8848:8848
      - 9848:9848
    environment:
      - PREFER_HOST_MODE=hostname
      - MODE=standalone
      - JVM_XMX=512m
      - JVM_XMS=512m
      - SPRING_DATASOURCE_PLATFORM=mysql
      - MYSQL_SERVICE_HOST=nacos-mysql
      - MYSQL_SERVICE_DB_NAME=nacos_devtest
      - MYSQL_SERVICE_PORT=3306
      - MYSQL_SERVICE_USER=nacos
      - MYSQL_SERVICE_PASSWORD=nacos
      - MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
      - NACOS_AUTH_IDENTITY_KEY=2222
      - NACOS_AUTH_IDENTITY_VALUE=2xxx
      - NACOS_AUTH_TOKEN=SecretKey012345678901234567890123456789012345678901234567890123456789
      - NACOS_AUTH_ENABLE=true
    volumes:
      - /app/nacos/standalone-logs/:/home/nacos/logs
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      nacos-mysql:
        condition: service_healthy
  nacos-mysql:
    container_name: nacos-mysql
    build:
      context: .
      dockerfile_inline: |
        FROM mysql:8.0.31
        ADD https://raw.githubusercontent.com/alibaba/nacos/2.3.2/distribution/conf/mysql-schema.sql /docker-entrypoint-initdb.d/nacos-mysql.sql
        RUN chown -R mysql:mysql /docker-entrypoint-initdb.d/nacos-mysql.sql
        EXPOSE 3306
        CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]
    image: nacos/mysql:8.0.30
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=nacos_devtest
      - MYSQL_USER=nacos
      - MYSQL_PASSWORD=nacos
      - LANG=C.UTF-8
    volumes:
      - nacos-mysqldata:/var/lib/mysql
      - /etc/localtime:/etc/localtime:ro
    ports:
      - '13306:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
      interval: 5s
      timeout: 10s
      retries: 10
  prometheus:
    image: prom/prometheus:v2.52.0
    container_name: prometheus
    restart: always
    ports:
      - 9090:9090
    volumes:
      - prometheus-data:/prometheus
      - prometheus-conf:/etc/prometheus
      - /etc/localtime:/etc/localtime:ro

  grafana:
    image: grafana/grafana:10.4.2
    container_name: grafana
    restart: always
    ports:
      - 3000:3000
    volumes:
      - grafana-data:/var/lib/grafana
      - /etc/localtime:/etc/localtime:ro

volumes:
  redis-data:
  redis-conf:
  mysql-conf:
  mysql-data:
  rabbit-data:
  rabbit-app:
  opensearch-data1:
  opensearch-data2:
  nacos-mysqldata:
  zookeeper_data:
  kafka-conf:
  kafka-data:
  kafkaui-app:
  prometheus-data:
  prometheus-conf:
  grafana-data:
```

## 在线 docker

https://labs.play-with-docker.com/

进入后可以获得四个小时的虚拟机环境，可以用来测试 docker 的各种功能。

可以先将将 docker 推送到远程，然后在虚拟机中去拉取镜像
