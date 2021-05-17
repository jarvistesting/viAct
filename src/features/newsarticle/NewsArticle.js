import React, {useState, useEffect} from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Box, Button, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import {fetchNewsByPage, articles} from './newsSlice';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  table: {
    margin: '32px auto',
    minWidth: 700,
    border: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.16)',
    borderRadius: 4
  },
  leftCol: {
    paddingLeft: '16px !important'
  },
  imageContainer: {
    width: '100px',
    height: '80px'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: '4px'
  },
  searchContainer: {
    textAlign: 'left'
  },
  textField: {
    width: '100%'
  },
  noDataFoundRow: {
    height: '200px'
  },
  noDataFoundCol: {
    textAlign: 'center'
  }
});

const StyledTableCell = withStyles(() => ({
  root: {
    borderBottom: 'none',
    fontSize: 14,
    color: '#333333',
    padding: '10px 2px'
  },
  head: {
    backgroundColor: '#F2F8FF',
    fontWeight: 600
  },
  body: {}
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#FAFCFF'
    },
    '&:hover': {
      backgroundColor: '#F7F8FA'
    }
  }
}))(TableRow);

const columns = [
  { id: 'urlToImage', label: 'Image' },
  { id: 'source', label: 'Source' },
  {
    id: 'author',
    label: 'Author',
  },
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'publishedAt',
    label: 'Date',
  },
  {
    id: 'url',
    label: 'URL',
  }
];

const createData = (urlToImage, source, author, title, publishedAt, url) => {
  return { urlToImage, source, author, title, publishedAt, url };
};

export function NewsArticle(props) {
    const classes = useStyles(),
        dispatch = useDispatch(),
        data = useSelector(articles),
        rowsPerPage = 10;

    const [count, setCount] = React.useState(100);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        dispatch(fetchNewsByPage({page: page+1, pageSize: rowsPerPage, query: null}));
    }, [])

    useEffect(() => {
        if (data && data.article && data.article.articles && data.article.articles.length) {
            let rows = getRowData(data.article.articles);
            
            setRows(rows);
            if (data.article.totalResults < 100) {
                setCount(data.article.totalResults)
            } else {
                setCount(100);
            }
        }
    }, [data]);

    const getRowData = (values) => {
        let candidateRow = values.map((value) => {
            if (value) {
                let rowData = createData(
                    value.urlToImage ? getImage(value.urlToImage) : '-',
                    value.source ? value.source.name : '-',
                    value.author || '-',
                    value.title || '-',
                    value.publishedAt || '-',
                    value.url ? getUrlBtn(value.url) : '-'
                );
                return rowData;
            }
        });
        return candidateRow;
    };

    const getImage = (url = '') => {
        return <div className={classes.imageContainer}>
            <img className={classes.image} src={url} alt={'Article thumbnail'} />
        </div>
    }

    const getUrlBtn = (url = '') => {
        return (
            <Button color={'primary'} href={url} variant={'contained'} target={'_blank'}>
                {'view'}
            </Button>
        )
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        dispatch(fetchNewsByPage({page: newPage+1, pageSize: rowsPerPage, query: query || null}));
    };

    // We can optimize filter using throtlling/debouncing due to lack of time I am not able to implement
    const handleFilterChange = (event) => {
        setQuery(event.target.value);
        setPage(0);

        if (event.target.value && event.target.value.trim().length > 2) {
            dispatch(fetchNewsByPage({page: 1, pageSize: rowsPerPage, query: event.target.value}));
        } else {
            dispatch(fetchNewsByPage({page: 1, pageSize: rowsPerPage, query: null}));
        }
    }

    return (
        <Container>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid item lg={5} md={5} sm={5} xs={10}>
                        <Box className={classes.searchContainer}>
                            <TextField 
                                id="filter-news" 
                                label="Filter news title and descrition" 
                                variant="outlined" 
                                className={classes.textField} 
                                size={'small'} 
                                onChange={handleFilterChange}
                                value={query}
                            />
                        </Box>
                    </Grid>

                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table" className={classes.table}>
                            <TableHead>
                                <StyledTableRow>
                                    {columns.map((column) => (
                                        <StyledTableCell
                                            key={column.id}
                                            align={column.align}
                                            className={classes.leftCol}
                                        >
                                            {column.label}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.status === 'idle' && rows && rows.length ? rows.map((row, index) => {
                                    return (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={`${row.author}_${index}`}>
                                            {columns.map((column) => {
                                                const value = row[column.id];

                                                return (
                                                    <StyledTableCell key={column.id} align={column.align} className={classes.leftCol}>
                                                        {value}
                                                    </StyledTableCell>
                                                );
                                            })}
                                        </StyledTableRow>
                                    );
                                }): (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} className={classes.noDataFoundRow}>
                                        <StyledTableCell className={`${classes.leftCol} ${classes.noDataFoundCol}`} colSpan={6}>
                                            {'Loading...'}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                    />
                </Grid>
            </Grid>
        </Container>
    )
};
