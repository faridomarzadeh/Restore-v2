import { Grid2, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useGetFiltersQuery, useGetProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog);
  const { data, isLoading } = useGetProductsQuery(productParams);
  const { data: filterData, isLoading: filtersLoading} = useGetFiltersQuery();
  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filterData) return <div>Loading...</div>;

  return (
    <Grid2 container spacing={4} sx={{ pb: 3 }}>
      <Grid2 size={3}>
        <Filters filterData={filterData}/>
      </Grid2>
      <Grid2 size={9}>
        {data.items && data.items.length > 0 ? (
          <>
            <ProductList products={data.items} />
            <AppPagination
              paginationData={data.pagination}
              onPageChange={(page) => 
                {
                  dispatch(setPageNumber(page))
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
            />
          </>
        ) : (
          <Typography variant="h5">
            There are no results for this filter
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
}
