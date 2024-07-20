# Asset Management System
Online Asset Management is a project in Phase 2 of the Rookie Program of NashTech. It provides features for tracking and managing users, assets, assignments, and returning requests.

[![Production CI-CD](https://github.com/duongminhhieu/Asset-Management-Frontend/actions/workflows/production-cicd.yml/badge.svg)](https://github.com/duongminhhieu/Asset-Management-Frontend/actions/workflows/production-cicd.yml)
[![Test Coverage](https://img.shields.io/badge/Code-Coverage-green)](https://duongminhhieu.github.io/Asset-Management-Frontend/)

<div style="text-align: center;">
    <img width="315" alt="Screenshot 2024-06-02 at 23 47 57" src="https://github.com/user-attachments/assets/4bdef888-e298-4272-9135-e6f89ae58b0b">
</div>

# Technologies
- Node 20
- React JS
- Ant Design
- TailwinCSS
- React Query
- Jest Testing
- Google Cloud
- Azure DevOps

# Architecture

<img width="1399" alt="Screenshot 2024-06-02 at 23 44 13" src="https://github.com/user-attachments/assets/953d0552-c775-464c-95b4-4939f5690a5c">

# Database Modeling
<img width="880" alt="Screenshot 2024-06-02 at 23 44 13" src="https://github.com/user-attachments/assets/5b99293a-c930-4cc0-aff3-22516f1a3d65">

# Setting Up and Running at Local

## Configuration
    
1. Set up environment variable:

    - Clone file **.env.sample** to the new file with name: **.env**
    - Update environment variable in the file **.env**
2. Install **node_modules**

    - ```bash
        npm install  
      ```
## Run
1. Build the Project
```bash
    npm build  
```
2. Run the Application
```bash
    npm run dev
```
3. Run Test
```bash
    npm run coverage
```
4. Note

   - Password for user is auto generated according to format [username]@[DOB in ddmmyyyy], eg: binhnv@20011993
   - Test account:
   ```bash
       username: hoangd
       password: Test#1234
    ```
    
# References
1. [JPA & JWT (Hoang Nguyen)] (https://github.com/hoangnd-dev/rookies-java)
2. [Springboot Demo (Phu Le)] (https://github.com/phulecse2420/demo)
5. NashTech Slide
