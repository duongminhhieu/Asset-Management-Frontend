import SearchFieldComponent from '@/components/SearchFieldComponent/SearchFieldComponent';
import React from 'react';
import { useSearchParams } from 'react-router-dom';


function ManageUser() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const onSearch = (value: string) => {
        
        setSearchParams({ search: value });

        console.log(searchParams.get('search'))

    }


    return (
        <div className='flex justify-end'> 
            <SearchFieldComponent onSearch={onSearch} /> 
        </div>  
    );
}

export default ManageUser;