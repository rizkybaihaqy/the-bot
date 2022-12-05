# Visit Dialog Flow

rough concept: user req -> reply back with response and other question -> repeat

## Example Successful Conversation

- a: /visit
- b: Whats Your Sales ID ?
- a: 1
- b: Sales ID: 1\nWhat the Sales Status?
- a: DEAL
- b: Sales ID: 1\nStatus: DEAL\nWhich the Channel?
- a: MIP
- b: Sales ID: 1\nStatus: DEAL\nChannel: MIP\nWhere the location?
- a: [SEND LOCATION]
- b: Sales ID: 1\nStatus: DEAL\nChannel: - MIP\nLocation: [Location Data]\nIs the data correct?
- a: Yes
- b: Data Saved To DB\nSales ID: 1\nStatus: DEAL\nChannel: MIP\nLocation: [Location Data]

## Flow Chart

```mermaid
flowchart TD
0(NO CHAT) --> 1
1(/visit) --> 2(Whats Your Sales ID ?)
2 --> | Sales Id | 3{Check DB Is the ID Valid ?}
3 --> |Yes| 4{Sales ID: 1\nWhat the Sales Status?}
3 --> |No| 2
4 --> | DEAL | 5{Sales ID: 1\nStatus: DEAL\nWhich the Channel ?}
4 --> | NO DEAL | 7
4 --> | Other Than DEAL OR NO DEAL | 4
5 --> | MIP OR SOBI OR Landing Page | 7{Sales ID: 1\nStatus: DEAL OR NO DEAL\nChannel: MIP\nWhere the location?}
5 --> | Other Than MIP OR SOBI OR Landing Page | 5
7 --> | Send Location Data | 8{Sales ID: 1\nStatus: DEAL OR NO DEAL\nChannel: MIP OR SOBI OR Landing Page\nLocation: `Location Data`\nIs the data correct?}
8 --> | Yes | 9(Data Saved To DB\nSales ID: 1\nStatus: DEAL\nChannel: MIP\nLocation: `Location Data`)
8 --> | No | 0
```
