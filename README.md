Simple subnetwork generator service. It takes last subnetwork for the given network, adds subnetwork size and returns next network. To configure per-server network just add new {server_name}.json to servers folder:
```json
{
    "name": "default",
    "network": "10.0.0.0/8",
    "subnetworkSize": "24",
    "lastSubnetwork": "10.0.0.0"
}
```
If service up and running at subnetwork.service, then 
```bash
docker network create --subnet=$(curl https://subnetwork.service/new/default) network_name
```

To use with docker-compose define network with subnetwork:
```yaml
  front:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: "${SUBNETWORK}"
```
and run 
```bash
docker-compose up -e SUBNETWORK=$(curl https://subnetwork.service/new/default)
```
