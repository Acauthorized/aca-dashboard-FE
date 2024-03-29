// import Router from "next/router";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  Radio,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import { CustomersRow } from "pages-sections/admin";
import { AgentRow } from "pages-sections/admin";
import useMuiTable from "hooks/useMuiTable";

import { useState, useEffect, useRef } from "react";
import CustomerPagination from "./pagination";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Paragraph } from "components/Typography";
import { Add } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { FlexBox } from "components/flex-box";
import Skeleton from "@mui/material/Skeleton";
import SearchInput from "components/SearchInput";

import axiosJWT from "../../../redux/axiosJWT";
import { REACT_APP_BASE_URL } from "../../../redux/baseURL";
import {
  FetchCustomers,
  FetchAgentCustomers,
  ChangeCustomerStatus,
  CustomerSerch,
} from "../../../redux/customerApiRequest";

import { FetchNotifications } from "../../../redux/notificationsApiRequest";

import { closeCustomerModel } from "../../../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useContextApp } from "../../../redux/socket/context";
import { stat } from "fs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateField } from "@mui/x-date-pickers/DateField";

import { DatePicker } from "@mui/x-date-pickers";
import { states } from "../../../redux/lang/Staties";

//import { connectSocket } from '../../../redux/socket/socketConnect';

// const tableHeading = [
//   {
//     id: "_id",
//     label: "ID",
//     align: "center",
//   },
//   {
//     id: "firstName",
//     label: "FirstName",
//     align: "center",
//   },
//   {
//     id: "email",
//     label: "Email",
//     align: "center",
//   },

//   {
//     id: "status",
//     label: "Status",
//     align: "center",
//   },

//   // {
//   //   id: "phoneNumber",
//   //   label: "PhoneNumber",
//   //   align: "center",
//   // },

//   {
//     id: "searchedBy",
//     label: "SearchedBy",
//     align: "center",
//   },

//   {
//     id: "action",
//     label: "Action",
//     align: "center",
//   },
// ];

// =============================================================================
CustomerList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

// =============================================================================

// ---------------------------------------------------

export default function CustomerList({}) {
  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID

  const downSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [status, setStatus] = useState(customerdata?.status || "");
  const [process, setProcess] = useState(customerdata?.process || null);

  const [note, setNote] = useState(customerdata?.note || "");

  const [searchstatus, setSearchStatus] = useState("all");

  const [sortText, setSortText] = useState("sorTBy");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  const [refetch , setrefetch]= useState(false)

  const [size, setSize] = useState(2);

  const [size_list, setSizeList] = useState([1, 2, 3, 4, 5, 6, 8, 9]);

  //////search customer  IIIIIIII
  const [fullname, setFullname] = useState("");
  const [ssn, setSsn] = useState("");
  const [city, setCity] = useState("");
  const [searchType, setSearchType] = useState("name");

  const handleSearchTypeChange = ({ target: { name } }) => {
    setSearchType(name);
  };

  const handlePaymentMethodChange = ({ target: { name } }) => {
    setStatus(name);
  };

  const handleProcessChange = ({ target: { name } }) => {
    console.log("name");

    if (name === "false") setProcess(false);
    else setProcess(true);
  };

  const handleSort = (event) => {
    setSortText(event.target.value);
    if (event.target.value === "firstnameAsc") {
      setSortBy("firstName");
      setSortDirection("asc");
    } else if (event.target.value === "firstnameDesc") {
      setSortBy("firstName");
      setSortDirection("desc");
    } else if (event.target.value === "emailAsc") {
      setSortBy("email");
      setSortDirection("asc");
    } else if (event.target.value === "emailDesc") {
      setSortBy("email");
      setSortDirection("desc");
    }
  };

  const [searchExiststatus, setSearchExistStatus] = useState("");
  const [searcDate, setSearchDate] = useState("");

  //const[date, setDate] =React.useState(dayjs(data.birthday));

  const handleSearchExistStatusChange = (event) => {
    setSearchExistStatus(event.target.value);
    console.log("name", event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
    console.log("city", event.target.value);
  };

  const handleSearchStatusChange = (event) => {
    setSearchStatus(event.target.value);
    console.log("name", event.target.value);
  };

  const handleSize = (event) => {
    setSize(event.target.value);
  };

  const onChange = (event) => {
    setNote(event.target.value);
  };

  const { allcustomers, count, open, customerdata, isFetching } = useSelector(
    (state) => state.customer
  );
  const currentUserId = useSelector(
    (state) => state.auth.login.currentUser.payload.id
  );

  const handleClose = () => {
    dispatch(closeCustomerModel());
    setStatus("");
    setProcess("");
    setNote("");
  };

  const userRole = useSelector(
    (state) => state.auth.login.currentUser.payload.roles
  );

  const userData = useSelector(
    (state) => state.auth.login?.currentUser?.payload
  );

  console.log("Role", userRole[0]);
  console.log("customer redux toolkit", allcustomers);

  const [soctext, setSocText] = useState("");
  const { socket } = useContextApp();

  const router = useRouter();
  console.log(router.query.agent, "qu💍🕶👓💍🕶👓ery");
  const handleChangeStatus = (customerdata, status, note) => {
    dispatch(ChangeCustomerStatus(customerdata, status, note, process));

    dispatch(
      FetchCustomers(
        custpage,
        size,
        searchstatus,
        sortBy,
        sortDirection,
        router.query?.agent
      )
    );

    setNote("");
    setNote("");

    socket.emit("status-customer", status);
  };

  const [custpage, setcustPage] = useState(0);

  const handleChange = (evt, value) => {
    evt.preventDefault();
    setcustPage(value);
  };

  const dispatch = useDispatch();
  const [customers, setCustomers] = useState(allcustomers ?? []);
  const [refresh, setRefesh] = useState(false);
  useEffect(() => {
    console.log("refetch execute", custpage);

    if (userRole[0] === "admin") {
      dispatch(
        FetchCustomers(
          custpage,
          size,
          searchstatus,
          sortBy,
          sortDirection,
          router.query?.agent
        )
      );
    } else if (userRole[0] === "staff") {
      dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));

      //toast.success("Refetch customers again");
    }
  }, [custpage, refresh, searchstatus, sortBy, sortDirection, size, socket]);

  const tableHeading = [
    {
      id: "_id",
      label: "ID",
      align: "center",
    },
    // {
    //   id: "firstName",
    //   label: "FirstName",
    //   align: "center",
    // },
    {
      id: "email",
      label: "Email",
      align: "center",
    },
    {
      id: "note",
      label: "Note",
      align: "center",
    },

    {
      id: "status",
      label: "Status",
      align: "center",
    },

    userRole[0] !== "admin"
      ? {
          id: "phoneNumber",
          label: "PhoneNumber",
          align: "center",
        }
      : {
          id: "searchedBy",
          label: "SearchedBy",
          align: "center",
        },

    {
      id: "process",
      label: "Process",
      align: "center",
    },

    userRole[0] === "admin"
      ? {
          id: "employe_id",
          label: "AgentName",
          align: "center",
        }
      : {
          id: "firstName",
          label: "FirstName",
          align: "center",
        },

    {
      id: "userimage",
      label: "picture",
      align: "center",
    },

    {
      id: "file",
      label: "Document",
      align: "center",
    },

    {
      id: "action",
      label: "Action",
      align: "center",
    },
  ];

  const filteredCustomers = allcustomers?.map((item) => ({
    id: item._id,
    slug: item?._id,
    firstName: item?.firstName,
    email: item?.email,
    address: item?.address,
    phoneNumber: item?.phoneNumber,
    SearchedBy: item?.SearchedBy,
    status: item?.status,
    file: item?.file,
    files: item?.files,
    audio: item?.audio,
    employe_id: item?.employe_id,
    note: item?.note,
    process: item?.process,
    userimage: item?.userimage,
  }));

  console.log("filterdcystomers", filteredCustomers);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
    page,
  } = useMuiTable({
    listData: filteredCustomers,
    //filteredBrands,
    defaultSort: "name",
    refresh,
    setRefesh,
  });

  console.log("??", page);

  const handleChange1 = (evt, value) => {
    evt.preventDefault();

    setcustPage(value);
  };


  useEffect(() => {
    // console.log("UNDER SOCKEEEEEEEEEEEEEEEEEEEEEEEET");

    // socket.on("connect_error", (err) => {
    //   // the reason of the error, for example "xhr poll error"
    //   console.log(err.message);
    //   toast.info(`message ${err.message}`);
    // });

    // socket.on("start", (data) => {
    //   console.log("socket start in server--->", data);
    //   toast.info(data);
    // });

    socket.on("order", (data) => {
      toast.info(data);
    });

    socket.on("search", (data) => {
      console.log("socket start in server--->", data);
      toast.info(data);
    });

    // socket.on("order", (data) => {
    //   console.log("order--->" ,data)
    //   toast.info(data);
    // });

    if (userRole[0] === "admin") {
      socket.on("createcustomer", (data) => {
        toast.info("new Customer CREATED");
        dispatch(
          FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
        );
        dispatch(FetchNotifications());
      });

      // search notification only show form admin
      // socket.on("search_cust", (data) => {
      //   //toast.info("some agent search for customer");

      //   if (userRole[0] === "admin") {
      //     toast.info("HI ADMIN some agent search for customer");
      //     dispatch(
      //       FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
      //     );
      //   } else if (userRole[0] === "staff") {
      //     toast.info("HI AGENT some agent search for customer");
      //     dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));
      //   }

      //   dispatch(FetchNotifications());
      // });
    }



    socket.on("search_server", (data) => {
     // toast.success(data.message);

      //toast.info("some agent search for customer");

      if (userRole[0] === "admin") {
        toast.info("HI ADMIN some agent search for customer");
        dispatch(
          FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
        );
      } else if (userRole[0] === "staff") {
        toast.info("HI AGENT some agent search for customer");
        dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));
      }

      dispatch(FetchNotifications());
      // setTimeout(function () {
      //   window.location.reload();
      // }, 5000);


    });

    //create_cust-execute

    socket.on("create_cust-execute", (data) => {
      //toast.success(data.message);

      //toast.info("some agent search for customer");

      if (userRole[0] === "admin") {
        toast.info("HI ADMIN some agent added for customer");
        dispatch(
          FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
        );
      }

      dispatch(FetchNotifications());
    });

    socket.on("status", (data) => {
      console.log("DATAAAAAAA SOCKETIO STATUS CHANGED 🖥️ 📱🖥️ 📱", data);

      console.log(
        `status 📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌${data.status}`
      );
     // toast.info(`customer status changed to ${data.status}`);


      if (userRole[0] === "admin") {
        toast.info(`customer status changed to ${data.status} `);
     //   toast.info("HI ADMIN some agent search for customer");
        dispatch(
          FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
        );
      } else if (userRole[0] === "staff") {
        toast.info(`customer status changed to ${data.status} ` );
       // toast.info("HI AGENT some agent search for customer");
        dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));
      }

      dispatch(FetchNotifications());




      // setTimeout(function () {
      //   window.location.reload();
      // }, 5000);



      // if (data?.receiver === userData?.id) {
      //   console.log("reciever", data.receiver, "currentUser", userData?.id);
      //   console.log("Customer Status changed📌📌📌📌📌📌📌📌📌📌", data);
      //   toast.info("customer status changed");
      //   dispatch(FetchNotifications()).then(() => {
      //     window.location.reload();
      //   });
      // }
    });
  }, [socket ]);






  // useEffect(() => {
  //   // console.log("UNDER SOCKEEEEEEEEEEEEEEEEEEEEEEEET");

  //   // socket.on("connect_error", (err) => {
  //   //   // the reason of the error, for example "xhr poll error"
  //   //   console.log(err.message);
  //   //   toast.info(`message ${err.message}`);
  //   // });

  //   // socket.on("start", (data) => {
  //   //   console.log("socket start in server--->", data);
  //   //   toast.info(data);
  //   // });

  //   socket.on("order", (data) => {
  //     toast.info(data);
  //   });


  //   // socket.on("search", (data) => {
  //   //   console.log("socket start in server--->", data);
  //   //   toast.info(data);
  //   // });

  //   // socket.on("order", (data) => {
  //   //   console.log("order--->" ,data)
  //   //   toast.info(data);
  //   // });

  //   if (userRole[0] === "admin") {
  //     socket.on("createcustomer", (data) => {
  //       toast.info("new Customer CREATED");
  //       dispatch(
  //         FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
  //       );
  //       dispatch(FetchNotifications());
  //     });

  //     // search notification only show form admin
  //     // socket.on("search_cust", (data) => {
  //     //   //toast.info("some agent search for customer");

  //     //   if (userRole[0] === "admin") {
  //     //     toast.info("HI ADMIN some agent search for customer");
  //     //     dispatch(
  //     //       FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
  //     //     );
  //     //   } else if (userRole[0] === "staff") {
  //     //     toast.info("HI AGENT some agent search for customer");
  //     //     dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));
  //     //   }

  //     //   dispatch(FetchNotifications());
  //     // });
  //   }

  //   socket.on("search_server", (data) => {
  //     //toast.success(data.message);

  //     //toast.info("some agent search for customer");

  //     if (userRole[0] === "admin") {
  //       toast.info("HI ADMIN some agent search for customer");
  //       dispatch(
  //         FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
  //       );
  //     } else if (userRole[0] === "staff") {
  //       toast.info("HI AGENT some agent search for customer");
  //       dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));
  //     }

  //     dispatch(FetchNotifications());
  //     // setTimeout(function () {
  //     //   window.location.reload();
  //     // }, 5000);
  //   });

  //   //create_cust-execute

  //   socket.on("create_cust-execute", (data) => {
  //     //toast.success(data.message);

  //     //toast.info("some agent search for customer");

  //     if (userRole[0] === "admin") {
  //       toast.info("HI ADMIN some agent added for customer");
  //       dispatch(
  //         FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
  //       );
  //     }

  //     dispatch(FetchNotifications());
  //   });

  //   socket.on("status", (data) => {
    

     
  //     // toast.info(`customer status changed to ${data.status}`);

  //     if (userRole[0] === "admin") {
  //       toast.info(`customer status changed to ${data.status} `);
  //       //   toast.info("HI ADMIN some agent search for customer");
  //       dispatch(
  //         FetchCustomers(custpage, size, searchstatus, sortBy, sortDirection)
  //       );
  //     } else if (userRole[0] === "staff") {
  //       toast.info(`customer status changed to ${data.status} `);
  //       // toast.info("HI AGENT some agent search for customer");
  //       dispatch(FetchAgentCustomers(custpage, size, sortBy, sortDirection));
  //     }

  //     dispatch(FetchNotifications());

  //     // setTimeout(function () {
  //     //   window.location.reload();
  //     // }, 5000);

  //     // if (data?.receiver === userData?.id) {
  //     //   console.log("reciever", data.receiver, "currentUser", userData?.id);
  //     //   console.log("Customer Status changed📌📌📌📌📌📌📌📌📌📌", data);
  //     //   toast.info("customer status changed");
  //     //   dispatch(FetchNotifications()).then(() => {
  //     //     window.location.reload();
  //     //   });
  //     // }
  //   });
  // }, [socket]);




  const ExecuteSocket = (data) => {
    console.log("HHIUHHIAHSH", data);
    socket.emit("search", data);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>All Customers </H3>

      <Card
        backgroundColor="grey.900"
        sx={{ height: "auto", marginBottom: "20px", padding: "14px" }}
      >
        <Box
          sx={{
            flexDirection: { xs: "column", lg: "row" },
            gap: "12px",
            display: "flex",
          }}
        >


          <Box  sx={{ display:'flex' , gap:'12px'}}>
          <SearchInput
            label={"search by FULLNAME "}
            // sx={{ flexGrow: 1 }}
            onChange={(e) => setFullname(e.target.value)}
          />

          <SearchInput
            label={"search by SSN "}
            // sx={{ flexGrow: 1 }}
            onChange={(e) => setSsn(e.target.value)}
          />

          </Box>
        
          <Box  sx={{ display:'flex' , gap:'12px'}}>

          {/* DATE--- */}
          <Box>
       

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "info",
                }}
                color="info"
                inputFormat="DD/MM/YYYY"
                // minDate={now}
                label="Choose customer birth date"
                value={searcDate}
                onChange={(newValue) => {
                  setSearchDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    sx={{
                      color: "info",
                      alignSelf: "center",
                      justifySelf: "center",
                      marginTop: "",
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>

          {/* --------Status customer exist search---- */}
          <Box
            width={"200px"}
            mr={"12px"}
            ml={"12px"}
            p={"0px"}
            item
            xs={12}
            lg={4}
          >
            <FormControl fullWidth size="small">
              <InputLabel color="info" id="demo-simple-select-label">
                State
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                color="info"
                value={city}
                label="FilterBy"
                onChange={handleCityChange}
              >

                {states.map((state,index)=>{
                  return (

<MenuItem key={index} color="info" value={state}>
{state}
</MenuItem> 
 )

                })}


                {/* <MenuItem color="info" value="all">
                    All
                  </MenuItem> */}

                {/* <MenuItem
                  color="info"
                  value="Florida"
                  sx={{ alignItems: "center" }}
                >
                  Florida
                </MenuItem>
                <MenuItem color="info" value="Newyork">
                  Newyork
                </MenuItem>

                <MenuItem color="info" value="Chicago">
                  Chicagp
                </MenuItem> */}

                {/* <MenuItem color="info" value="admincustomers">
                    admin customer
                  </MenuItem> */}
              </Select>
            </FormControl>
          </Box>

</Box>
          <Button
            color="info"
            fullWidth={downSM}
            variant="contained"
            // startIcon={<Add />}
            onClick={() =>
              dispatch(
                CustomerSerch(fullname, ssn, ExecuteSocket, city, searcDate)
              )
            }
            sx={
              {
                // minHeight: 44,
              }
            }
          >
            Search
          </Button>
        </Box>
        {/* 
        <Stack spacing={3} mb={3}>
          <div>
            <FormControlLabel
              name="name"
              sx={{
                mb: 3,
              }}
              value={searchType}
              onChange={handleSearchTypeChange}
              label={<Paragraph fontWeight={600}>NAME</Paragraph>}
              control={
                <Radio
                  checked={searchType === "name"}
                  color="info"
                  size="small"
                />
              }
            />

            <FormControlLabel
              name="ssn"
              sx={{
                mb: 3,
              }}
              value={searchType}
              onChange={handleSearchTypeChange}
              label={<Paragraph fontWeight={600}>SSN</Paragraph>}
              control={
                <Radio
                  checked={searchType === "ssn"}
                  color="info"
                  size="small"
                />
              }
            />
          </div>
        </Stack> */}
      </Card>

      <div>
        {/* <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap"> */}
        <Grid container spacing={3}>
          {/* <Grid item sx={12} lg={2}>
            <SearchInput
         
            />
          </Grid> */}

          <Grid item xs={12} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel color="info" id="demo-simple-select-label">
                SortBy
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                color="info"
                label="FilterBy"
                value={sortText}
                onChange={handleSort}
              >
                <MenuItem value={"firstnameAsc"} sx={{ alignItems: "center" }}>
                  sortBy FirstName Asc
                </MenuItem>

                <MenuItem value="firstnameDesc" sx={{ alignItems: "center" }}>
                  sortBy FirstName Desc
                </MenuItem>

                <MenuItem value="emailAsc">sortBy Email Asc</MenuItem>

                <MenuItem value="emailDesc">sortBy Email Desc</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel color="info" id="demo-simple-select-label">
                Size
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={size}
                label="Size"
                color="info"
                onChange={handleSize}
              >
                {size_list.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {userRole[0] === "admin" && (
            <Grid item xs={12} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel color="info" id="demo-simple-select-label">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  color="info"
                  value={searchstatus}
                  label="FilterBy"
                  onChange={handleSearchStatusChange}
                >
                  <MenuItem color="info" value="all">
                    All
                  </MenuItem>

                  <MenuItem
                    color="info"
                    value="accepted"
                    sx={{ alignItems: "center" }}
                  >
                    Accepted
                  </MenuItem>
                  <MenuItem color="info" value="pending">
                    Pending
                  </MenuItem>

                  <MenuItem color="info" value="rejected">
                    Rejected
                  </MenuItem>

                  <MenuItem color="info" value="admincustomers">
                    admin customer
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item sx={12} lg={4}>
            <Button
              color="info"
              fullWidth={downSM}
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/admin/customer/create")}
              sx={
                {
                  // minHeight: 44,
                }
              }
            >
              Add Customer
            </Button>
          </Grid>
        </Grid>
        {/* </FlexBox> */}
      </div>

      {isFetching ? (
        <div>
          <Card sx={{ marginTop: "12px" }}>
            <Skeleton
              variant="rounded"
              width={"full"}
              height={60}
              sx={{ margin: "12px" }}
            />
            <Skeleton
              variant="rounded"
              width={"full"}
              height={60}
              sx={{ margin: "12px" }}
            />
          </Card>
        </div>
      ) : (
        <Card>
          <Scrollbar>
            <TableContainer
              sx={{
                minWidth: 600,
              }}
            >
              <Table>
                <TableHeader
                  order={order}
                  hideSelectBtn
                  orderBy={orderBy}
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
                  onRequestSort={handleRequestSort}
                />

                {filteredCustomers && (
                  <TableBody>
                    {filteredCustomers?.map((customer) => (
                      <CustomersRow
                        userRole={userRole}
                        customer={customer}
                        key={customer.id}
                        selected={selected}
                      />
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <Stack alignItems="center" my={4}>
            {/* <CustomerPagination
              count={Math.ceil(count / size)}
              

              handleChange={handleChange1}
            /> */}
            <Pagination
              count={Math.ceil(count / size)}
              variant="outlined"
              color="info"
              page={custpage}
              onChange={handleChange1}
              sx={{ "& ul": { justifyContent: "center" }, my: 3 }}
            />
          </Stack>
        </Card>
      )}

      {/* -----status update modal--- */}

      {userRole[0] === "admin" && customerdata?.firstName && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit customer status</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              Customer information
            </DialogContentText> */}

            <Stack spacing={3} mb={3}>
              <div>
                <h3>Status:</h3>
                <FormControlLabel
                  name="accepted"
                  sx={{
                    mb: 3,
                  }}
                  value={status}
                  onChange={handlePaymentMethodChange}
                  label={<Paragraph fontWeight={600}>Accept</Paragraph>}
                  control={
                    <Radio
                      checked={status === "accepted"}
                      color="info"
                      size="small"
                    />
                  }
                />

                <FormControlLabel
                  name="rejected"
                  sx={{
                    mb: 3,
                  }}
                  value={status}
                  onChange={handlePaymentMethodChange}
                  label={<Paragraph fontWeight={600}>Reject</Paragraph>}
                  control={
                    <Radio
                      checked={status === "rejected"}
                      color="info"
                      size="small"
                    />
                  }
                />
              </div>

              {/* ---process--- */}
              <div>
                <h3>Long Process Form: </h3>

                <FormControlLabel
                  name="false"
                  sx={{
                    mb: 3,
                  }}
                  value={process}
                  onChange={handleProcessChange}
                  label={<Paragraph fontWeight={600}>False</Paragraph>}
                  control={
                    <Radio
                      checked={process === false}
                      color="info"
                      size="small"
                    />
                  }
                />

                <FormControlLabel
                  name="true"
                  sx={{
                    mb: 3,
                  }}
                  value={process}
                  onChange={handleProcessChange}
                  label={<Paragraph fontWeight={600}>True</Paragraph>}
                  control={
                    <Radio
                      checked={process === true}
                      color="info"
                      size="small"
                    />
                  }
                />
              </div>

              <TextField
                label="Note"
                name="note"
                rows={2}
                multiline
                value={note}
                onChange={onChange}
                variant="outlined"
                size="medium"
                color="info"
              />
            </Stack>

            {/* <TextField rows={6} multiline fullWidth color="info" size="medium" name="description" onBlur={handleBlur} onChange={handleChange} value={values.description} label="Description (optional)" error={Boolean(errors.description && touched.description)} helperText={touched.description && errors.description} /> */}
          </DialogContent>
          <DialogActions>
            <Button className="   text-indigo-600" onClick={handleClose}>
              Close
            </Button>

            {/* {customerdata?.status === "pending" && ( */}
            <Button
              disabled={!note || !status}
              sx={{ backgroundColor: "primary.info" }}
              className=" "
              onClick={
                () => handleChangeStatus(customerdata, status, note)
                // dispatch(ChangeCustomerStatus(customerdata, status, note))
              }
            >
              Change status
            </Button>
            {/* )} */}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
