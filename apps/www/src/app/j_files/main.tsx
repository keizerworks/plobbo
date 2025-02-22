import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1c35e98b"; const _jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import "/src/styles/index.css?t=1740228449100";
import { defaultShouldDehydrateQuery, QueryClient, QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=c29ef26d";
import { createRouter, RouterProvider } from "/node_modules/.vite/deps/@tanstack_react-router.js?v=86643e39";
import { NuqsAdapter } from "/node_modules/.vite/deps/nuqs_adapters_react.js?v=b592f736";
import __vite__cjsImport5_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=2e62fb0e"; const ReactDOM = __vite__cjsImport5_reactDom_client.__esModule ? __vite__cjsImport5_reactDom_client.default : __vite__cjsImport5_reactDom_client;
import SuperJSON from "/node_modules/.vite/deps/superjson.js?v=d80b3a3b";
import NotFoundError from "/src/components/errors/not-found.tsx";
import { Toaster } from "/src/components/ui/sonner.tsx";
import { routeTree } from "/src/route-tree.gen.ts?t=1740228449100";
import GeneralError from "/src/components/errors/general-error.tsx";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 30 * 1000
        },
        dehydrate: {
            serializeData: SuperJSON.serialize,
            shouldDehydrateQuery: (query)=>defaultShouldDehydrateQuery(query) || query.state.status === "pending"
        },
        hydrate: {
            deserializeData: SuperJSON.deserialize
        }
    }
});
const router = createRouter({
    routeTree,
    defaultPreload: false,
    context: {
        queryClient
    },
    defaultNotFoundComponent: NotFoundError,
    defaultErrorComponent: GeneralError,
    Wrap: ({ children })=>{
        return /*#__PURE__*/ _jsxDEV(NuqsAdapter, {
            children: [
                children,
                /*#__PURE__*/ _jsxDEV(Toaster, {}, void 0, false, {
                    fileName: "/home/sudarsh/dev/keizer/plobbo/apps/dash/src/main.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "/home/sudarsh/dev/keizer/plobbo/apps/dash/src/main.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
});
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("app");
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(/*#__PURE__*/ _jsxDEV(QueryClientProvider, {
        client: queryClient,
        children: /*#__PURE__*/ _jsxDEV(RouterProvider, {
            router: router
        }, void 0, false, {
            fileName: "/home/sudarsh/dev/keizer/plobbo/apps/dash/src/main.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "/home/sudarsh/dev/keizer/plobbo/apps/dash/src/main.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this));
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIn4vc3R5bGVzL2luZGV4LmNzc1wiO1xuXG5pbXBvcnQge1xuICBkZWZhdWx0U2hvdWxkRGVoeWRyYXRlUXVlcnksXG4gIFF1ZXJ5Q2xpZW50LFxuICBRdWVyeUNsaWVudFByb3ZpZGVyLFxufSBmcm9tIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI7XG5pbXBvcnQgeyBjcmVhdGVSb3V0ZXIsIFJvdXRlclByb3ZpZGVyIH0gZnJvbSBcIkB0YW5zdGFjay9yZWFjdC1yb3V0ZXJcIjtcbmltcG9ydCB7IE51cXNBZGFwdGVyIH0gZnJvbSBcIm51cXMvYWRhcHRlcnMvcmVhY3RcIjtcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tL2NsaWVudFwiO1xuaW1wb3J0IFN1cGVySlNPTiBmcm9tIFwic3VwZXJqc29uXCI7XG5cbmltcG9ydCBOb3RGb3VuZEVycm9yIGZyb20gXCJ+L2NvbXBvbmVudHMvZXJyb3JzL25vdC1mb3VuZFwiO1xuaW1wb3J0IHsgVG9hc3RlciB9IGZyb20gXCJ+L2NvbXBvbmVudHMvdWkvc29ubmVyXCI7XG5pbXBvcnQgeyByb3V0ZVRyZWUgfSBmcm9tIFwifi9yb3V0ZS10cmVlLmdlblwiO1xuXG5pbXBvcnQgR2VuZXJhbEVycm9yIGZyb20gXCIuL2NvbXBvbmVudHMvZXJyb3JzL2dlbmVyYWwtZXJyb3JcIjtcblxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoe1xuICBkZWZhdWx0T3B0aW9uczoge1xuICAgIHF1ZXJpZXM6IHtcbiAgICAgIC8vIFdpdGggU1NSLCB3ZSB1c3VhbGx5IHdhbnQgdG8gc2V0IHNvbWUgZGVmYXVsdCBzdGFsZVRpbWVcbiAgICAgIC8vIGFib3ZlIDAgdG8gYXZvaWQgcmVmZXRjaGluZyBpbW1lZGlhdGVseSBvbiB0aGUgY2xpZW50XG4gICAgICBzdGFsZVRpbWU6IDMwICogMTAwMCxcbiAgICB9LFxuICAgIGRlaHlkcmF0ZToge1xuICAgICAgc2VyaWFsaXplRGF0YTogU3VwZXJKU09OLnNlcmlhbGl6ZSxcbiAgICAgIHNob3VsZERlaHlkcmF0ZVF1ZXJ5OiAocXVlcnkpID0+XG4gICAgICAgIGRlZmF1bHRTaG91bGREZWh5ZHJhdGVRdWVyeShxdWVyeSkgfHwgcXVlcnkuc3RhdGUuc3RhdHVzID09PSBcInBlbmRpbmdcIixcbiAgICB9LFxuICAgIGh5ZHJhdGU6IHtcbiAgICAgIGRlc2VyaWFsaXplRGF0YTogU3VwZXJKU09OLmRlc2VyaWFsaXplLFxuICAgIH0sXG4gIH0sXG59KTtcblxuY29uc3Qgcm91dGVyID0gY3JlYXRlUm91dGVyKHtcbiAgcm91dGVUcmVlLFxuICBkZWZhdWx0UHJlbG9hZDogZmFsc2UsXG4gIGNvbnRleHQ6IHsgcXVlcnlDbGllbnQgfSxcbiAgZGVmYXVsdE5vdEZvdW5kQ29tcG9uZW50OiBOb3RGb3VuZEVycm9yLFxuICBkZWZhdWx0RXJyb3JDb21wb25lbnQ6IEdlbmVyYWxFcnJvcixcbiAgV3JhcDogKHsgY2hpbGRyZW4gfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8TnVxc0FkYXB0ZXI+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPFRvYXN0ZXIgLz5cbiAgICAgIDwvTnVxc0FkYXB0ZXI+XG4gICAgKTtcbiAgfSxcbn0pO1xuXG5kZWNsYXJlIG1vZHVsZSBcIkB0YW5zdGFjay9yZWFjdC1yb3V0ZXJcIiB7XG4gIGludGVyZmFjZSBSZWdpc3RlciB7XG4gICAgcm91dGVyOiB0eXBlb2Ygcm91dGVyO1xuICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG5jb25zdCByb290RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpITtcblxuaWYgKCFyb290RWxlbWVudC5pbm5lckhUTUwpIHtcbiAgY29uc3Qgcm9vdCA9IFJlYWN0RE9NLmNyZWF0ZVJvb3Qocm9vdEVsZW1lbnQpO1xuICByb290LnJlbmRlcihcbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgIDxSb3V0ZXJQcm92aWRlciByb3V0ZXI9e3JvdXRlcn0gLz5cbiAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICApO1xufVxuIl0sIm5hbWVzIjpbImRlZmF1bHRTaG91bGREZWh5ZHJhdGVRdWVyeSIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlDbGllbnRQcm92aWRlciIsImNyZWF0ZVJvdXRlciIsIlJvdXRlclByb3ZpZGVyIiwiTnVxc0FkYXB0ZXIiLCJSZWFjdERPTSIsIlN1cGVySlNPTiIsIk5vdEZvdW5kRXJyb3IiLCJUb2FzdGVyIiwicm91dGVUcmVlIiwiR2VuZXJhbEVycm9yIiwicXVlcnlDbGllbnQiLCJkZWZhdWx0T3B0aW9ucyIsInF1ZXJpZXMiLCJzdGFsZVRpbWUiLCJkZWh5ZHJhdGUiLCJzZXJpYWxpemVEYXRhIiwic2VyaWFsaXplIiwic2hvdWxkRGVoeWRyYXRlUXVlcnkiLCJxdWVyeSIsInN0YXRlIiwic3RhdHVzIiwiaHlkcmF0ZSIsImRlc2VyaWFsaXplRGF0YSIsImRlc2VyaWFsaXplIiwicm91dGVyIiwiZGVmYXVsdFByZWxvYWQiLCJjb250ZXh0IiwiZGVmYXVsdE5vdEZvdW5kQ29tcG9uZW50IiwiZGVmYXVsdEVycm9yQ29tcG9uZW50IiwiV3JhcCIsImNoaWxkcmVuIiwicm9vdEVsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicm9vdCIsImNyZWF0ZVJvb3QiLCJyZW5kZXIiLCJjbGllbnQiXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLHFCQUFxQjtBQUU1QixTQUNFQSwyQkFBMkIsRUFDM0JDLFdBQVcsRUFDWEMsbUJBQW1CLFFBQ2Qsd0JBQXdCO0FBQy9CLFNBQVNDLFlBQVksRUFBRUMsY0FBYyxRQUFRLHlCQUF5QjtBQUN0RSxTQUFTQyxXQUFXLFFBQVEsc0JBQXNCO0FBQ2xELE9BQU9DLGNBQWMsbUJBQW1CO0FBQ3hDLE9BQU9DLGVBQWUsWUFBWTtBQUVsQyxPQUFPQyxtQkFBbUIsZ0NBQWdDO0FBQzFELFNBQVNDLE9BQU8sUUFBUSx5QkFBeUI7QUFDakQsU0FBU0MsU0FBUyxRQUFRLG1CQUFtQjtBQUU3QyxPQUFPQyxrQkFBa0Isb0NBQW9DO0FBRTdELE1BQU1DLGNBQWMsSUFBSVgsWUFBWTtJQUNsQ1ksZ0JBQWdCO1FBQ2RDLFNBQVM7WUFDUCwwREFBMEQ7WUFDMUQsd0RBQXdEO1lBQ3hEQyxXQUFXLEtBQUs7UUFDbEI7UUFDQUMsV0FBVztZQUNUQyxlQUFlVixVQUFVVyxTQUFTO1lBQ2xDQyxzQkFBc0IsQ0FBQ0MsUUFDckJwQiw0QkFBNEJvQixVQUFVQSxNQUFNQyxLQUFLLENBQUNDLE1BQU0sS0FBSztRQUNqRTtRQUNBQyxTQUFTO1lBQ1BDLGlCQUFpQmpCLFVBQVVrQixXQUFXO1FBQ3hDO0lBQ0Y7QUFDRjtBQUVBLE1BQU1DLFNBQVN2QixhQUFhO0lBQzFCTztJQUNBaUIsZ0JBQWdCO0lBQ2hCQyxTQUFTO1FBQUVoQjtJQUFZO0lBQ3ZCaUIsMEJBQTBCckI7SUFDMUJzQix1QkFBdUJuQjtJQUN2Qm9CLE1BQU0sQ0FBQyxFQUFFQyxRQUFRLEVBQUU7UUFDakIscUJBQ0UsUUFBQzNCOztnQkFDRTJCOzhCQUNELFFBQUN2Qjs7Ozs7Ozs7Ozs7SUFHUDtBQUNGO0FBUUEsb0VBQW9FO0FBQ3BFLE1BQU13QixjQUFjQyxTQUFTQyxjQUFjLENBQUM7QUFFNUMsSUFBSSxDQUFDRixZQUFZRyxTQUFTLEVBQUU7SUFDMUIsTUFBTUMsT0FBTy9CLFNBQVNnQyxVQUFVLENBQUNMO0lBQ2pDSSxLQUFLRSxNQUFNLGVBQ1QsUUFBQ3JDO1FBQW9Cc0MsUUFBUTVCO2tCQUMzQixjQUFBLFFBQUNSO1lBQWVzQixRQUFRQTs7Ozs7Ozs7Ozs7QUFHOUIifQ==