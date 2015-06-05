<?php 

    // Specify database from $arg[1] //
    $dir = 'sqlite:HQ_MSPB.sqlite';

    // Instantiate PDO connection object or failure msg //
    $dbh = new PDO($dir) or die("cannot open database");

    // Define your SQL statement //
    $query = '
    Select 
    [ProviderID] AS \'provider\',
    [Hospital Name] AS \'hospital\',
    [CountyName] AS \'county\',
    [Score],
    [FULL_FIPS],
    [Latitude] AS \'latitude\',
    [Longitude] AS \'longitude\'
    FROM PerfByGeo 
    WHERE [Latitude] != \'FAILED\'
';

    
    // Iterate through the results and pass into JSON encoder //
    
    $json = array(); 
    
    foreach ($dbh->query($query) as $row) {

        $item = array(
            'provider' => (string)$row[0],
            'hospital' => (string)$row[1],
            'county'=> (string)$row[2],
            'score' => (real)$row[3],
            'FIPS'  => (int)$row[4],
            'latitude' => (real)$row[5],
            'longitude' => (real)$row[6]
        );

        $json[] = $item;

    }
        echo json_encode($json, JSON_UNESCAPED_SLASHES);

?> 

